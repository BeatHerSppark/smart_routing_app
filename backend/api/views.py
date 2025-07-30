from django.http import JsonResponse
import json
import os
import requests
from dotenv import load_dotenv

load_dotenv()

ORS_API_KEY = os.getenv("ORS_API_KEY")

def find_optimal_route(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method. Use POST.'}, status=405)

    data = json.loads(request.body)
    markers = data.get('markers', [])
    route_type = data.get('type', 'round_trip')
    profile = data.get('transportation', 'driving-car')

    if len(markers) < 2:
        return JsonResponse({'error': 'At least 2 markers required!'}, status=400)

    headers = {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
    }

    try:
        locations = [[lng, lat] for lat, lng in markers]

        if route_type == 'round_trip':
            jobs = [{'id': i + 1, 'location': loc} for i, loc in enumerate(locations)]
            vehicle = {
                'id': 1,
                'start': locations[0],
                'end': locations[0],
                'profile': profile
            }
            optimization_body = {'jobs': jobs, 'vehicles': [vehicle]}
        elif len(locations) == 2:
            ordered_points = locations
            return fetch_route_response(ordered_points, profile, headers)
        else:
            best_duration = float('inf')
            best_ordered = None

            for i in range(len(locations)):
                start_loc = locations[i]
                waypoints = [loc for j, loc in enumerate(locations) if j != i]
                jobs = [{'id': k + 1, 'location': wp} for k, wp in enumerate(waypoints)]
                vehicle = {'id': 1, 'start': start_loc, 'profile': profile}
                body = {'jobs': jobs, 'vehicles': [vehicle]}

                resp = requests.post(
                    'https://api.openrouteservice.org/optimization',
                    headers=headers,
                    json=body,
                    timeout=20
                )
                data_opt = resp.json()
                if 'routes' not in data_opt:
                    continue

                route = data_opt['routes'][0]
                duration = route.get('duration', 0)
                print(duration)
                step_ids = [step['job'] for step in route['steps'] if step['type'] == 'job']

                ordered_jobs = [waypoints[idx - 1] for idx in step_ids]
                candidate = [start_loc] + ordered_jobs

                if duration < best_duration:
                    best_duration = duration
                    best_ordered = candidate

            print(best_ordered)
            if not best_ordered:
                return JsonResponse({'error': 'No route found in optimization.'}, status=400)

            ordered_points = best_ordered

        if route_type == 'round_trip':
            opt_resp = requests.post(
                'https://api.openrouteservice.org/optimization',
                headers=headers,
                json=optimization_body,
                timeout=20
            )
            opt_data = opt_resp.json()
            step_ids = [step['job'] for step in opt_data['routes'][0]['steps'] if step['type'] == 'job']
            ordered_jobs = [locations[i - 1] for i in step_ids]
            ordered_points = [locations[0]] + ordered_jobs + [locations[0]]

        return fetch_route_response(ordered_points, profile, headers)

    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f'Request failed: {str(e)}'}, status=500)


def fetch_route_response(ordered_points, profile, headers):
    routing_body = {
        'coordinates': ordered_points,
        'instructions': True,
        'format': 'geojson'
    }

    route_response = requests.post(
        f'https://api.openrouteservice.org/v2/directions/{profile}/geojson',
        headers=headers,
        json=routing_body,
        timeout=20
    )
    route_data = route_response.json()
    print(route_data)

    if 'features' not in route_data:
        return JsonResponse({'error': 'No directions found.', 'ors_response': route_data}, status=400)

    feature = route_data['features'][0]
    coordinates = feature['geometry']['coordinates']
    steps = feature['properties']['segments'][0]['steps']

    converted_steps = [
        {
            'instruction': step['instruction'],
            'name': step.get('name', ''),
            'location': coordinates[step['way_points'][0]] if step.get('way_points') else None,
            'distance': step.get('distance'),
            'duration': step.get('duration'),
            'type': step.get('type'),
            'way_points': step.get('way_points')
        }
        for step in steps
    ]

    return JsonResponse({
        'trips': [{
            'geometry': {
                'coordinates': coordinates
            },
            'legs': [{
                'steps': converted_steps
            }]
        }]
    })