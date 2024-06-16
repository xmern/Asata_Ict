from django.shortcuts import render
from django.conf import settings
import os
from django.http import JsonResponse
from rest_framework import viewsets, views
from rest_framework import views, response, exceptions, permissions,status
from user import services, authentication
from rest_framework.parsers import FormParser, MultiPartParser,JSONParser
from .serializers import FilesSerializer,FolderSerializer,UserfilesSerializer,UserfoldersSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import File,Folder,UserFiles,UserFolders,FileChunk

# Create your views here.




class FileListUploadAPI(APIView):
    parser_classes=[FormParser,MultiPartParser,JSONParser]
    
    def get(self, request):
        files = File.objects.all()
        serializer = FilesSerializer(files, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.data:
            return Response({'error': 'No data was sent'}, status=status.HTTP_400_BAD_REQUEST)
        if 'userid' not in request.data:
            return Response({'error': 'Userid is required'}, status=status.HTTP_400_BAD_REQUEST)    
        if 'folderid' not in request.data:
            return Response({'error': 'Folderid is required'}, status=status.HTTP_400_BAD_REQUEST)            
        if 'file' not in request.data:
            return Response({'error': 'File is required'}, status=status.HTTP_400_BAD_REQUEST)
        if 'filename' not in request.data:
            return Response({'error': 'Filename is required'}, status=status.HTTP_400_BAD_REQUEST)
        userid = request.data["userid"]
        folderid = request.data["folderid"]
        #file_type = request.data["file"].split(".")
        filedata = {"filename":request.data["filename"],"filetype":request.data["filetype"],"file":request.data["file"]}
        serializer = FilesSerializer(data=filedata)
        

        if serializer.is_valid() :
            # Save the instance and retrieve the saved instance
            saved_file_instance = serializer.save()
            
            # Get the ID of the saved instance
            file_id = saved_file_instance.id
            # add the file to the userfile ledger
            userfiledata = {"userid":userid,"fileid":file_id,"folderid":folderid}
            userfileserializer = UserfilesSerializer(data=userfiledata)
            if userfileserializer.is_valid():
                userfileserializer.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MobileFileListUploadAPI(APIView):
    parser_classes = [FormParser, MultiPartParser]

    def get(self, request):
        files = File.objects.all()
        serializer = FilesSerializer(files, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.data:
            return Response({'error': 'No data was sent'}, status=status.HTTP_400_BAD_REQUEST)
        if request.data.get('file_id'):

            try:
                userid = request.data['userid']
                folderid = request.data['folderid']
                file_id = request.data.get('file_id')  # Get file ID if it exists
                filename = request.data['filename']
                filetype = request.data['filetype']
                chunk = request.data['file']
                chunk_index = int(request.data['chunkIndex'])
                total_chunks = int(request.data['totalChunks'])
            except KeyError as e:
                return Response({'error': f'Missing key: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                userid = request.data['userid']
                folderid = request.data['folderid']
                filename = request.data['filename']
                filetype = request.data['filetype']
                file_id = request.data.get('file_id')
                #chunk = request.data['file']
                #chunk_index = int(request.data['chunkIndex'])
                #total_chunks = int(request.data['totalChunks'])
            except KeyError as e:
                return Response({'error': f'Missing key: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)            
        # Create or retrieve the file record
        if file_id:
            file = File.objects.get(id=file_id)
        else:
            file = File.objects.create(filename=filename, filetype=filetype)
            file_id = file.id
            return Response({'file_id': file_id})
        # Save the file chunk
        file_chunk = FileChunk(file=file, chunk=chunk, chunk_index=chunk_index)
        file_chunk.save()

        # Check if all chunks are uploaded
        if file.chunks.count() == total_chunks:
            # Combine chunks
            with open(os.path.join(settings.MEDIA_ROOT, 'files', filename), 'wb') as destination_file:
                for i in range(total_chunks):
                    chunk = file.chunks.get(chunk_index=i)
                    destination_file.write(chunk.chunk.read())
                    chunk.chunk.close()
                    chunk.delete()

            # Update the file's FileField
            file.file.name = f'files/{filename}'
            file.save()

            # Add the file to the userfile ledger
            userfiledata = {"userid": userid, "fileid": file.id, "folderid": folderid}
            userfileserializer = UserfilesSerializer(data=userfiledata)
            if userfileserializer.is_valid():
                userfileserializer.save()
                return Response({'status': 'File uploaded and combined successfully', 'file_id': file.id}, status=status.HTTP_201_CREATED)

        return Response({'status': 'Chunk uploaded successfully', 'file_id': file_id}, status=status.HTTP_200_OK)
def FileList(request):
    pass
class FileList(views.APIView):
    authentication_classes = (authentication.CustomUserAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    def get(self,request):
        pass
    def post(self,request):
        pass
class FolderCreationApi(views.APIView):    
    authentication_classes = (authentication.CustomUserAuthentication,)
    permission_classes = (permissions.IsAuthenticated,) 

    def post(self,request):
        userid = request.data["userid"]  
        rootfolderid = request.data["rootfolderid"]
        folderdata = {"name":request.data["name"] }     
        serializer = FolderSerializer(data=folderdata)
        if serializer.is_valid():
            serializer.save()
            # Save the instance and retrieve the saved instance
            saved_file_instance = serializer.save()
            
            # Get the ID of the saved instance
            folder_id = saved_file_instance.id
            # add the file to the userfile ledger
            userfolderdata = {"userid":userid,"folderid":folder_id, "rootFolderid":rootfolderid}
            userfoldersserializer = UserfoldersSerializer(data=userfolderdata)
            if userfoldersserializer.is_valid():
                userfoldersserializer.save()            
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileManagerApi(APIView):

    def get(self, request,getroot, user_id, folder_id, page_size):
        
        # Validate request parameters
        getroot = bool(getroot)
        user_id = int(user_id)
        folder_id = int(folder_id)
        page_size = int(page_size)
        if getroot:
            # Step 1: Filter UserFolder by user_id
            user_folders = UserFolders.objects.filter(userid=user_id)
            
            # Step 2: Extract folder_ids
            folder_ids = user_folders.values_list('folderid', flat=True)
            
            # Step 3: Use folder_ids to filter Folder table and find the folder with name 'root'
            try:
                root_folder = Folder.objects.get(id__in=folder_ids, name='root')
                folder_id = root_folder.id
                serializer = FolderSerializer(data=root_folder)
            except Folder.DoesNotExist:
                
                folderdata = {"name":"root" }     
                serializer = FolderSerializer(data=folderdata)
                if serializer.is_valid():
                    serializer.save()
                    # Save the instance and retrieve the saved instance
                    saved_file_instance = serializer.save()
                    
                    # Get the ID of the saved instance
                    created_folder_id = saved_file_instance.id
                    # add the file to the userfile ledger
                    userfolderdata = {"userid":user_id,"folderid":created_folder_id}
                    userfoldersserializer = UserfoldersSerializer(data=userfolderdata)
                    if userfoldersserializer.is_valid():
                        userfoldersserializer.save()            
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            
            # Step 4: Serialize the root_folder
            serializer = FolderSerializer(root_folder)
            
            # Step 5: Return the serialized data
            return Response(serializer.data)

        if not getroot:
            # Check if the folder belongs to the user
            user_folders = UserFolders.objects.filter(userid=user_id, folderid=folder_id)
            if not user_folders.exists():
                return Response({'error': 'Folder not found for this user.'}, status=404)

            # Fetch all UserFolder objects with the same folder_id
            related_folders = UserFolders.objects.filter(rootFolderid=folder_id)
            #folder_serializer = UserfoldersSerializer(related_folders, many=True)
            folder_ids = related_folders.values_list('folderid', flat=True)

            # Fetch corresponding File objects
            folders = Folder.objects.filter(id__in=folder_ids)
            folder_serializer = FolderSerializer(folders, many=True)


            # Fetch all UserFile objects matching the folder_id and user_id
            user_files = UserFiles.objects.filter(folderid=folder_id, userid=user_id)
            file_ids = user_files.values_list('fileid', flat=True)

            # Fetch corresponding File objects
            files = File.objects.filter(id__in=file_ids)
            file_serializer = FilesSerializer(files, many=True)

            # Combine folders and files based on page_size
            total_items = related_folders.count() + files.count()

            # Calculate how many folders and files to return
            if total_items > page_size:
                folder_count = folders.count()
                if folder_count >= page_size:
                    folders_to_return = folders[:page_size]
                    files_to_return = []
                else:
                    files_to_return = files[:(page_size - folder_count)]
                    folders_to_return = folders
            else:
                folders_to_return = folders
                files_to_return = files

            # Serialize final results
            folder_serializer = FolderSerializer(folders_to_return, many=True)
            file_serializer = FilesSerializer(files_to_return, many=True)

            return Response({
                'folders': folder_serializer.data,
                'files': file_serializer.data
            })


class FileSizeView(APIView):
    def get(self, request, file_id):
        try:
            file = File.objects.get(id=file_id)
        except File.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = FilesSerializer(file)
        return Response(serializer.data)
class FolderSizeView(APIView):
    def get(self, request, folder_id, user_id):
        # Fetch all UserFile objects matching the folder_id and user_id
        user_files = UserFiles.objects.filter(folderid=folder_id, userid=user_id)
        file_ids = user_files.values_list('fileid', flat=True)

        # Fetch corresponding File objects
        files = File.objects.filter(id__in=file_ids)

        # Calculate the total size
        total_size = sum(file.file_size for file in files)

        # Serialize the results
        file_serializer = FilesSerializer(files, many=True)

        return Response({
            'totalSize': total_size,
            'files': file_serializer.data
        })

class TestApi(views.APIView):
    def get(self, request):
        print(type(request.data))
        return Response(status.HTTP_200_OK)