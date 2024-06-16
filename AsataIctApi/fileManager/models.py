from django.db import models
from django.utils import timezone

# Create your models here.

class File(models.Model):
    filename = models.CharField(max_length=255)
    date_created = models.DateTimeField(default=timezone.now) 
    filetype = models.CharField(max_length=255)
    file = models.FileField(upload_to='files/')
    def __str__(self):
        return self.filename
    @property
    def file_size(self):
        return self.file.size
class FileChunk(models.Model):
    file = models.ForeignKey(File, related_name='chunks', on_delete=models.CASCADE)
    chunk = models.FileField(upload_to='file_chunks/')
    chunk_index = models.IntegerField()

    class Meta:
        unique_together = ('file', 'chunk_index')    
class UserFiles(models.Model):
    userid = models.IntegerField()
    fileid = models.IntegerField()
    folderid = models.IntegerField()    
    
class UserFolders(models.Model):
    userid = models.IntegerField()
    folderid = models.IntegerField()
    rootFolderid = models.IntegerField(blank=True, null=True)
class SharedFile(models.Model):
    userid = models.IntegerField()
    shared_userid = models.IntegerField()
    fileid = models.IntegerField()

class SharedFolder(models.Model):
    userid = models.IntegerField()
    shared_userid = models.IntegerField()
    folderid = models.IntegerField()

class Folder(models.Model):
    name = models.CharField(max_length=255)
    date_created = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.name
class Event(models.Model):
    date = models.DateField()
    name = models.CharField(max_length=255)        

