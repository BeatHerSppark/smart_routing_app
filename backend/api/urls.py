from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

app_name = 'api'

urlpatterns = [
    path('find-optimal-route', csrf_exempt(views.find_optimal_route), name="find_optimal_route")
]