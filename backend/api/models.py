from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    REQUIRED_FIELDS = ['user']
    USERNAME_FIELD = 'user.username'
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('developer', 'Developer'),
        ('tester', 'Tester'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    def __str__(self):
        return self.username

class Bug(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_by")
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assigned_to")
    priority = models.CharField(max_length=20, default="Low")
    logs = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.title