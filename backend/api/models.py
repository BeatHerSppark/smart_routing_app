from django.db import models
from django.contrib.auth.models import User

class SavedRoute(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_routes')
    name = models.CharField(max_length=255)
    markers = models.JSONField(help_text="Array of marker coordinates [lat, lng]")
    route_type = models.CharField(max_length=50, choices=[('round_trip', 'Round Trip'), ('one_way', 'One Way')], default='round_trip')
    transportation = models.CharField(max_length=50, choices=[('driving-car', 'Driving'), ('cycling-regular', 'Cycling'), ('foot-walking', 'Walking')], default='driving-car')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        unique_together = ['user', 'name']

    def __str__(self):
        return f"{self.user.username} - {self.name}"

    def get_markers_count(self):
        return len(self.markers) if self.markers else 0
