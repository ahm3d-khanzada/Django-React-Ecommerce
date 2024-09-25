# views.py
from typing import Any, Dict
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
# from .products import products
from .serializer import ProductSerializer , UserSerializer , UserSerializerWithToken , UserChangePasswordSerializer , SendPasswordResetEmailSerializer, UserPasswordResetSerializer
from .models import Products
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.serializers import ValidationError
from django.db import IntegrityError
from django.http import HttpResponse  # Add this import
from django.contrib.auth.tokens import PasswordResetTokenGenerator

# for sending mails and gernating tokens
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode , urlsafe_base64_encode
from .utils import TokenGenerator, generate_token
from django.utils.encoding import force_bytes, force_text, force_str,DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View 
from rest_framework.views import APIView
from django.contrib.auth.views import PasswordResetView
from django.urls import reverse_lazy
import threading
# Create your views here.

class EmailThread(threading.Thread):
    def __init__(self,email_message):
        self.email_message = email_message
        threading.Thread.__init__(self)
    
    def run(self):
        self.email_message.send()
        
        

@api_view(['GET'])
def getRoutes(request):
    return Response({"message": "Hello, world"})

# @api_view(['GET'])
# def getProduct(request):
#     return Response(products)

@api_view(['GET'])
def getProduct(request):
    products = Products.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProducts(request, pk):
    products = Products.objects.get(id=pk)
    serializer = ProductSerializer(products, many=False)
    return Response(serializer.data)
 

# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)

#         # Add custom claims
#         token['username'] = user.username
#         token['email'] = user.email
#         # Add any other custom claims as needed
#         return token

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Override the validate method to customize the response
    def validate(self, attrs):
        # Call the parent's validate method to check credentials
        data = super().validate(attrs)
        
        # Use the custom serializer to add additional user data
        serializer = UserSerializerWithToken(self.user).data
        
        # Combine custom user data with the original response
        data.update(serializer)  # Use update instead of looping for cleaner code
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    # Specify the custom serializer for this view
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user  # Get the authenticated user
    serializer = UserSerializer(user, many=False)  # Serialize the single user
    return Response(serializer.data)  # Return the serialized data

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()  # Get all users from the database
    serializer = UserSerializer(users, many=True)  # Serialize all users
    return Response(serializer.data)  # Return the serialized list of users


@api_view(['POST'])
def registerUser(request):
    data = request.data
    print(f"Received data: {data}")  # Debugging line
    try:
        user = User.objects.create(
            first_name=data['fname'],
            last_name=data['lname'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False
        )

        # Generate token for sending email
        email_subject = "Activate Your Account"
        message = render_to_string(
            "activate.html",
            {
                'user': user,
                'domain': 'http://127.0.0.1:8000/',
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': generate_token.make_token(user),
            }
        )

        # Define your email parameters
        subject = email_subject
        from_email = settings.EMAIL_HOST_USER  # Sender's email address
        to_email = [data['email']]  # Recipient's email address

        # Create the email message
        email_message = EmailMessage(subject, message, from_email, to_email)

        # Send the email
        EmailThread(email_message).start()

        # Serialize user data
        serialize = UserSerializerWithToken(user, many=False)
        message = {'details': "Please activate your account using the link received in your email."}
        return Response(message, status=status.HTTP_201_CREATED)
    except IntegrityError:
        # Handle the unique constraint error and provide a JSON response
        message = {'details': "User with this username or email already exists."}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as e:
        return Response({"details": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message = {'details': "An error occurred: " + str(e)}
        return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as e:
            user = None

        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            message = {"details": 'Account is Activated'}
            # Change: Use HttpResponse instead of Response since View class is not from Django REST Framework.
            return render(request, "activatesuccess.html",status=status.HTTP_200_OK) 
        else:
            # Change: Return HttpResponse instead of Response for invalid activation link.
            return render(request, "activatefail.html",status=status.HTTP_400_BAD_REQUEST)
        



        
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializzer = UserChangePasswordSerializer(data=request.data, context = {'user': request.user})
        if serializzer.is_valid(raise_exception=True):
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
        return Response(serializzer.errors , status=status.HTTP_400_BAD_REQUEST)
                

from django.shortcuts import render


class SendPasswordResetEmailView(APIView):
    def post(self, request):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPasswordResetView(APIView):
    def post(self, request, uid, token):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

