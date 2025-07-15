from django.urls import path
from .views import RegisterView, GetCSRFToken, LoginView, LogoutView, CheckAuthenticatedView, DeleteAccountView, MeView

urlpatterns = [
    path('authenticated', CheckAuthenticatedView.as_view(), name='authenticated'),
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('me', MeView.as_view(), name='me'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('delete', DeleteAccountView.as_view(), name='delete'),
    path('csrf_cookie', GetCSRFToken.as_view(), name='csrf-cookie'),
]
