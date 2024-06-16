from django.urls import path
from .apis import FileListUploadAPI,MobileFileListUploadAPI, TestApi,FolderCreationApi,FileManagerApi,FileSizeView,FolderSizeView


urlpatterns = [
    path("testapi/", TestApi.as_view(), name="test"),
    path("fileupload/", FileListUploadAPI.as_view(),name="fileupload"),
    path("mobilefileupload/", MobileFileListUploadAPI.as_view(),name="mobilefileupload"),
    path("foldercreation/", FolderCreationApi.as_view(), name="foldercreation"),
    path('filesview/<int:getroot>/<int:user_id>/<int:folder_id>/<int:page_size>', FileManagerApi.as_view(), name='file-manager'),
    path('file_size/<int:file_id>/', FileSizeView.as_view(), name='file-size'),
    path('folder_size/<int:folder_id>/<int:user_id>/', FolderSizeView.as_view(), name='folder-size'),


]