
from authlogic.views import RegistrationView, LoginView
from django.urls import path
from authlogic.views import LogoutView
from authlogic.views import UserDetailView

urlpatterns = [path("register/",RegistrationView.as_view(),name='Register'),
               path('logout/', LogoutView.as_view(), name='logout'),
               path("login/",LoginView.as_view(),name='Login'),
               path('details/', UserDetailView.as_view(), name='user_details')]    