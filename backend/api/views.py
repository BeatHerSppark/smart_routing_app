from django.http import JsonResponse
import json
import requests


def find_optimal_route(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        markers = data.get('markers', [])
        route_type = data.get('type', 'round_trip')
        transportation_mode = data.get('transportation', 'car')

        if len(markers) < 2:
            return JsonResponse({'error': 'Потребни се барем 2 маркери!'}, status=400)

        profile_map = {
            'car': 'driving',
            'bike': 'cycling',
            'foot': 'walking'
        }
        osrm_profile = profile_map.get(transportation_mode, 'driving')
        markers_formatted = ';'.join([f'{lng},{lat}' for lat, lng in markers])

        if route_type == 'round_trip':
            api_url = f'http://router.project-osrm.org/trip/v1/{osrm_profile}/{markers_formatted}?roundtrip=true&source=first&destination=last&steps=true&geometries=geojson'
        else:
            api_url = f'http://router.project-osrm.org/trip/v1/{osrm_profile}/{markers_formatted}?roundtrip=false&source=first&destination=any&steps=true&geometries=geojson'

        try:
            response = requests.get(api_url, timeout=10)
            response.raise_for_status()
            result = response.json()

            return JsonResponse(result)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': f'OSRM барањето не успеа: {e}'}, status=500)

    return JsonResponse({'error': 'Невалиден метод. Потребен е POST.'}, status=405)