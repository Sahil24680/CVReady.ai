from django.urls import path
from .views import upload_file

urlpatterns = [
    # Endpoint for uploading a resume and receiving AI feedback
    path("upload/", upload_file,name="upload_file"), 
]
