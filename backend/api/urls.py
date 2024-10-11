from django.urls import path
from . import views

urlpatterns = [
    path("bugs/", views.BugListCreate.as_view(), name="bugs"),
    path("bugs/<int:pk>/", views.BugDelete.as_view(), name="delete_bug"),
]