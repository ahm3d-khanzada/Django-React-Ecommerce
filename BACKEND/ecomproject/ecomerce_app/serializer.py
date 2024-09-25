from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Products
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.validators import EmailValidator
from django.utils.encoding import smart_str , force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode ,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'
        
        
class UserSerializer(serializers.ModelSerializer):
    # Adding custom fields using SerializerMethodField
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)  # Corrected field name
    isAdmin = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        # Include all desired fields in the serializer
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']
        
    # Method to get the full name of the user
    def get_name(self, obj):
        first_name = obj.first_name  # Corrected to 'first_name' (Django's default field)
        last_name = obj.last_name  # Corrected to 'last_name' (Django's default field)
        name = f"{first_name} {last_name}".strip()  # Use f-string and strip to handle extra spaces
        if not name:  # Check if name is empty
            name = 'Anonymous'
        return name
    
    # Method to get the user's ID
    def get__id(self, obj):  # Corrected method name to match '_id' field
        return obj.id
    
    # Method to check if the user is an admin
    def get_isAdmin(self, obj):
        return obj.is_staff
            

class UserSerializerWithToken(UserSerializer):  # Inherit from UserSerializer to avoid code duplication
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        # Include token field in addition to UserSerializer fields
        fields = UserSerializer.Meta.fields + ['token']  # Reuse fields from UserSerializer
        
    # Method to generate a token for the user
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    
    
class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        
        if password != password2:
            raise serializers.ValidationError({'password2': 'Passwords must match'})
        
        user.set_password(password)
        user.save()
        
        return attrs


class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(
        max_length=255,
        error_messages={
            'blank': 'Email field cannot be empty.',
            'required': 'Email field is required.',
            'invalid': 'Enter a valid email address.'
        }
    )

    def validate(self, attrs):
        email = attrs.get('email')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)

            # Generate the reset link
            reset_link = f"http://localhost:5173/#/reset-password/{uid}/{token}/"

            # Render email template
            email_body = render_to_string(
                "password_reset_form.html",  # Template for the email body
                {
                    'user': user,
                    'domain': 'http://127.0.0.1:8000/',  # Replace with actual domain
                    'uid': uid,
                    'token': token,
                }
            )

            # Send the password reset email
            email_subject = "Reset your password"
            email = EmailMessage(email_subject, email_body, settings.EMAIL_HOST_USER, [user.email])
            email.send()

            return attrs
        else:
            raise serializers.ValidationError({'detail': 'This email address is not registered.'})

        
class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')

            if password != password2:
                raise serializers.ValidationError({'password2': 'Passwords must match'})

            # Decode the uid to get user id
            user_id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=user_id)

            # Check if the token is valid
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError({'token': 'The reset link is invalid or has expired.'})

            # Save the new password
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError({'token': 'The reset link is invalid or has expired.'})
