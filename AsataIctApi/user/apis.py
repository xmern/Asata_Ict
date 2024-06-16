from django.shortcuts import render
from rest_framework import views, response, exceptions, permissions,status
from .services import user_email_selector, create_user,create_token
from .serializers import UserSerializer
from fileManager.serializers import FolderSerializer, UserfoldersSerializer
from . import services, authentication
#from . import services, authentication

# Create your views here.

class RegisterApi(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        print("ok up to this piont")
        
        if serializer.is_valid():            
            data = serializer.validated_data
            
            serializer.instance = create_user(user_dc=data)
            userid = serializer.instance.id
            folderserial = FolderSerializer(data={'name':'root'})
            if folderserial.is_valid():
                folderserial.save()
                # Save the instance and retrieve the saved instance
                saved_folder_instance = folderserial.save()
                
                # Get the ID of the saved instance
                folder_id = saved_folder_instance.id
                # add the file to the userfile ledger
                userfolderdata = {"userid":userid,"folderid":folder_id}
                userfoldersserializer = UserfoldersSerializer(data=userfolderdata)
                if userfoldersserializer.is_valid():
                    userfoldersserializer.save()             
        
            return response.Response(data=serializer.data,status=status.HTTP_201_CREATED)
        response.Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class LoginApi(views.APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = user_email_selector(email=email)

        if user is None:
            raise exceptions.AuthenticationFailed("Invalid Credentials please check your email or password")

        if not user.check_password(raw_password=password):
            raise exceptions.AuthenticationFailed("Invalid Credentials please check your email or password")

        token = create_token(user_id=user.id)

        resp = response.Response({"id":user.id,"email":user.email,"jwt":token})

        resp.set_cookie(key="jwt", value=token, httponly=True)

        return resp

class UserApi(views.APIView):
    """
    This endpoint can only be used
    if the user is authenticated
    """

    authentication_classes = (authentication.CustomUserAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user

        serializer = UserSerializer(user)

        return response.Response(serializer.data)

