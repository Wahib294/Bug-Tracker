from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ProfileSerializer, BugSerializer
from .models import Bug, Profile

# Create your views here.

class ProfileUserView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

class BugListCreate(generics.ListCreateAPIView):
    serializer_class = BugSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "Admin":
            return Bug.objects.all()
        elif user.role == "Developer":
            return Bug.objects.filter(assigned_to=user)
        elif user.role == "QA":
            return Bug.objects.filter(created_by=user)
        else:
            return Bug.objects.none()

    def perform_create(self, serializer):
        if (self.request.user.role == "Admin" or self.request.user.role == "QA") and serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)
class BugDelete(generics.DestroyAPIView):
    serializer_class = BugSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.role == "Admin":
            return Bug.objects.all()
        elif user.role == "QA":
            return Bug.objects.filter(created_by=user)
        else:
            return Bug.objects.none()