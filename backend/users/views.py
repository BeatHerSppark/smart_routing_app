from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect


@method_decorator(csrf_protect, name='dispatch')
class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        try:
            isAuthenticated = User.is_authenticated

            if isAuthenticated:
                return Response({ 'isAuthenticated': 'success' })
            return Response({ 'isAuthenticated': 'error' })
        except:
            return Response({ 'error': 'CheckAuthenticatedView went wrong...' })


@method_decorator(csrf_protect, name='dispatch')
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = request.data
        username, password, password2 = data['username'], data['password'], data['password2']

        if password != password2:
            return Response({ 'error': 'Passwords do not match!' }, status=400)

        try:
            if User.objects.filter(username=username).exists():
                return Response({ 'error': 'Username already exists!' }, status=400)

            if len(password) < 8:
                return Response({ 'error': 'Password must be at least 8 characters!' }, status=400)

            user = User.objects.create_user(username=username, password=password)
            user.save()

            return Response({ 'success': 'User created successfully.' })
        except:
            return Response({ 'error': 'RegisterView went wrong...' })


@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = request.data
        username, password = data['username'], data['password']

        try:
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                print("works")
                return Response({ 'success': 'User authenticated.', 'username': username })
            return Response({ 'error': 'Invalid credentials!' })
        except:
            return Response({ 'error': 'LoginView went wrong...' })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({ "username": request.user.username })


class LogoutView(APIView):
    def post(self, request, format=None):
        try:
            logout(request)
            return Response({ 'success': "Logged out" })
        except:
            return Response({ 'error': 'LogoutView went wrong...' })


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set' })


class DeleteAccountView(APIView):
    def delete(self, request, format=None):
        try:
            user = request.user
            User.objects.filter(id=user.id).delete()
            return Response({ 'success': 'User deleted successfully.' })
        except:
            return Response({ 'error': 'User deletion went wrong...' })
