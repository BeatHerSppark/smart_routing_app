from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect


# @method_decorator(csrf_protect, name='dispatch')
# class CheckAuthenticatedView(APIView):
#     def get(self, request, format=None):
#         try:
#             isAuthenticated = User.is_authenticated

#             if isAuthenticated:
#                 return Response({ 'isAuthenticated': 'success' })
#             return Response({ 'isAuthenticated': 'error' })
#         except:
#             return Response({ 'error': 'CheckAuthenticatedView went wrong...' })


@method_decorator(csrf_protect, name='dispatch')
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = request.data
        u, p, p2 = data.get("username"), data.get("password"), data.get("password2")

        if not all([u, p, p2]):
            return Response({"error": "All fields required"}, status=400)
        if p != p2:
            return Response({"error": "Passwords do not match"}, status=400)

        try:
            if User.objects.filter(username=u).exists():
                return Response({"error": "Username taken"}, status=400)
            if len(p) < 8:
                return Response({"error": "Password too short"}, status=400)

            User.objects.create_user(username=u, password=p)
            return Response({"detail": "User created"}, status=201)
        except:
            return Response({ 'error': 'RegisterView went wrong...' })


@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = request.data

        try:
            user = authenticate(username=data.get("username"), password=data.get("password"))
            if user is None:
                return Response({"error": "Invalid credentials"}, status=400)

            request.session.flush()
            login(request, user)
            return Response({"detail": "Logged in", "username": user.username})
        except:
            return Response({ 'error': 'LoginView went wrong...' })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({ "username": request.user.username })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        logout(request)
        return Response({"detail": "Logged out"})


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'detail': 'CSRF cookie set' })


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        request.user.delete()
        return Response({"detail": "Account deleted"})
