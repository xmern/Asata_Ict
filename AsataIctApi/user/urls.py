from django.urls import path

from .apis import RegisterApi,LoginApi,UserApi

urlpatterns = [
    path("register/", RegisterApi.as_view(), name="register"),
    path("login/", LoginApi.as_view(), name="login"),
    path("me/", UserApi.as_view(), name="me")
]
    