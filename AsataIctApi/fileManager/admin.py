from django.contrib import admin
from .models import File,Folder,UserFiles,UserFolders

# Register your models here.
admin.site.register([File,Folder,UserFiles,UserFolders])
