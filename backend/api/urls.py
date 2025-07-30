from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

app_name = 'api'

urlpatterns = [
    path('find-optimal-route', csrf_exempt(views.find_optimal_route), name="find_optimal_route"),
    path('saved-routes/', views.saved_routes_list_create, name='saved_routes_list_create'),
    path('saved-routes/<int:pk>/', views.saved_route_detail, name='saved_route_detail'),
]