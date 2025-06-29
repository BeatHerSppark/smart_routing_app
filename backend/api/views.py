from django.shortcuts import render
from django.http import JsonResponse
import json
import requests

def find_optimal_route(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        markers = data['markers']
        transportation = data['transportation']

        if len(markers) < 2:
            return JsonResponse({'error': 'Must have at least 2 markers!'}, status=400)

        markers_formatted = ';'.join([f'{lng},{lat}' for lat,lng in markers])
        api_url = f'http://router.project-osrm.org/trip/v1/{transportation}/{markers_formatted}?steps=true&geometries=geojson&annotations=true'

        response = requests.get(api_url)

        if response.status_code == 200:
            result = response.json()
            return JsonResponse(result)

        return JsonResponse({'error': 'OSRM request failed'}, status=500)
