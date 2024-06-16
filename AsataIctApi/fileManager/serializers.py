from rest_framework import serializers
from .models import File,UserFiles,Folder,UserFolders


class FilesSerializer(serializers.ModelSerializer):
    file_size = serializers.ReadOnlyField()
    class Meta:
        model = File
        fields = '__all__'
class UserfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFiles
        fields = '__all__'            
class FolderSerializer(serializers.ModelSerializer):
    #date_created = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Folder
        fields = '__all__'  
class UserfoldersSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFolders
        fields = '__all__'               