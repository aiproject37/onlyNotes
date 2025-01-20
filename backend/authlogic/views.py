from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from authlogic.serializers import LogoutSerializer
from django.contrib.auth import authenticate
from .serializers import LoginSerializer
from django.conf import settings
from authlogic.serializers import RegistrationSerializer, LoginSerializer
from django.contrib.auth import authenticate
from .models import User
from django.core.cache import cache
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user  # Get the authenticated user
            data = {
                'id': user.id,
                'name': user.name,  # Returns full name if available, otherwise username
                'email': user.email,
                # Add any other user fields you need
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch user details'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class RegistrationView(APIView):
    def post(self, request, format=None):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({"token":token,"message": " Registration success"}, status=status.HTTP_200_OK) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        # Deserialize the incoming data
        serializer = LoginSerializer(data=request.data)
        
        # Validate the incoming data (email and password)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Authenticate the user with email and password
            user = authenticate(request, email=email, password=password)
            
            # If authentication is successful
            if user is not None:
                # Generate a refresh token for the authenticated user
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                # Create the response object with the access token
                response = Response(
                    {
                        "access": access_token,  # Return the access token in the response
                    },
                    status=status.HTTP_200_OK,
                )

                # Set the refresh token in an HTTP-only cookie (this will be automatically sent by the browser on subsequent requests)
                response.set_cookie(
                    key='refreshToken',  # Cookie name
                    value=str(refresh),  # The actual refresh token value
                    httponly=True,  # Make the cookie HTTP-only (cannot be accessed via JavaScript)
                    secure=False,  # Ensure it's only sent over HTTPS in production
                    max_age=settings.JWT_REFRESH_TOKEN_LIFETIME.total_seconds(),  # Token expiration time
                    samesite='Lax',  # Prevent CSRF attacks by limiting cookie usage
                )
                
                # Return the response
                return response

            else:
                # Authentication failed
                return Response(
                    {'errors': {'non_field_errors': ['Invalid email or password.']}},
                    status=status.HTTP_404_NOT_FOUND
                )

        # If serializer data is invalid, return error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        # Debug all cookies
        print("All cookies:", request.COOKIES)
        print("All headers:", request.headers)
        
        # Try multiple ways to access the refresh token
        refresh_token = request.COOKIES.get('refreshToken')
        raw_cookie = request.META.get('HTTP_COOKIE', '')
        
        print("Specific refresh token:", refresh_token)
        print("Raw cookie header:", raw_cookie)
        
        response = Response({"msg": "success"})
        
        # Delete cookie with complete parameters
        response.delete_cookie(
            key='refreshToken',
            path='/',           # Specify the path
            domain=None,        # Use None for same domain
            samesite='Lax'
        )
        
        return response
    
class SendOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        otp = get_random_string(length=6, allowed_chars='0123456789')  # Generate a 6-digit OTP
        cache.set(f"otp_{email}", otp, timeout=120)  # Store OTP in cache for 2 minutes

        # Send OTP via email
        send_mail(
            'Your OTP for Password Reset',
            f'Your OTP is {otp}. It expires in 2 minutes.',
            'noreply@example.com',
            [email],
            fail_silently=False,
        )

        return Response({'message': 'OTP sent successfully to your email.'}, status=status.HTTP_200_OK)


# Step 2: Verify OTP
class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)

        cached_otp = cache.get(f"otp_{email}")

        if cached_otp is None:
            return Response({'error': 'OTP expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        if cached_otp != otp:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        cache.delete(f"otp_{email}")  # Clear the OTP after successful verification
        return Response({'message': 'OTP verified successfully.'}, status=status.HTTP_200_OK)
    
# Step 3: Reset Password
class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not email or not new_password or not confirm_password:
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)