from django.conf import settings
from rest_framework import authentication, exceptions,permissions
import jwt

from . import models


class CustomUserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        token = request.data["jwt"]
        print(token)

        if not token:
            return None

        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
           
        except:
            
            raise exceptions.AuthenticationFailed("Unauthorized")

        user = models.User.objects.filter(id=payload["id"]).first()
        return (user, None)




class IsStaff(permissions.BasePermission):
    """
    Custom permission to only allow access to staff users.
    """

    def has_permission(self, request,view):
        # Check if the user is authenticated and is staff
        return request.user and request.user.is_authenticated and request.user.is_staff
