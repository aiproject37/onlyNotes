
from authlogic.views import RegistrationView, LoginView
from django.urls import path
from authlogic.views import LogoutView
from authlogic.views import UserDetailView,SendOTPView,VerifyOTPView,ResetPasswordView

urlpatterns = [path("register/",RegistrationView.as_view(),name='Register'),
               path('logout/', LogoutView.as_view(), name='logout'),
               path("login/",LoginView.as_view(),name='Login'),
               path('details/', UserDetailView.as_view(), name='user_details'),
               path('send-otp/', SendOTPView.as_view(), name='send-otp'),
               path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
               path('reset-password/', ResetPasswordView.as_view(), name='reset-password')]    