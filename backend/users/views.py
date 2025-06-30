from django.shortcuts import render
from django.http import HttpResponse

def register_view(request):
    return HttpResponse("Register page")

def login_view(request):
    return HttpResponse("Login page")

def logout_view(request):
    return HttpResponse("Logout page")

# from django.http import JsonResponse
# import json
# from supabase import create_client, Client
# import os
#
# # Иницијализација на Supabase клиентот
# # Препорачливо е овие вредности да се во settings.py или .env фајл
# SUPABASE_URL = "Твојот-Supabase-URL"
# SUPABASE_KEY = "Твојот-Supabase-Key"
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
#
# def register_view(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         email = data.get('email')
#         password = data.get('password')
#
#         if not email or not password:
#             return JsonResponse({'error': 'Потребни се е-пошта и лозинка.'}, status=400)
#
#         try:
#             # Користи ја Supabase функцијата за регистрација
#             res = supabase.auth.sign_up({
#                 "email": email,
#                 "password": password,
#             })
#             # res.user, res.session
#             return JsonResponse(res.user.dict(), status=201)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)
#
# def login_view(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         email = data.get('email')
#         password = data.get('password')
#
#         try:
#             # Користи ја Supabase функцијата за логирање
#             res = supabase.auth.sign_in_with_password({
#                 "email": email,
#                 "password": password
#             })
#             # Врати ги податоците за сесијата и корисникот на frontend
#             return JsonResponse({
#                 'access_token': res.session.access_token,
#                 'user': res.user.dict()
#             })
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)
#
# def logout_view(request):
#     # За logout, frontend-от само треба да го избрише токенот од local storage
#     # Овој endpoint можеби и не е потребен ако се работи со stateless токени
#     return JsonResponse({'message': 'Logout успешен.'})
