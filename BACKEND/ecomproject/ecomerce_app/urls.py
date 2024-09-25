from django.urls import path
from ecomerce_app import views  # Ensure the import path is correct
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    # TokenRefreshView,
)

from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.getRoutes, name="getRoutes"),
    path('products/', views.getProduct, name="getProduct"),
    path('product/<str:pk>', views.getProducts, name="getProduct"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', views.getUserProfile, name="getUserProfile"),  # Profile endpoint for the authenticated user
    path('users/', views.getUsers, name="getUsers"),  # Endpoint for admin to list all users
    path('users/register/', views.registerUser, name="register"),
    path('activate/<uidb64>/<token>', views.ActivateAccountView.as_view(), name="activate"),
    
    # path('password_reset/', views.CustomPasswordResetView.as_view(), name='password_reset'),
    # path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    # path('password_reset_confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    # path('password_reset_complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('users/changepassword/', views.ChangePasswordView.as_view(), name='changepassword'),
    path('users/send-reset-password-email/', views.SendPasswordResetEmailView.as_view(), name='reset-password-email'),
    path('users/reset-password/<uid>/<token>/', views.UserPasswordResetView.as_view(), name='password_reset_confirm'),
    ]
