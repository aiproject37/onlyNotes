
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib import admin
from django.urls import path, include


urlpatterns = [path("admin/", admin.site.urls),path('api/',include('notelogic.urls')),path('api/user/', include('authlogic.urls')),path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')]    