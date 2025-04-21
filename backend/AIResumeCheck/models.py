from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Resume_data(models.Model):
    """
    Stores metadata and AI-generated feedback for each uploaded resume.
    """
    # File name 
    Resume_name = models.CharField(max_length=255)

    # JSON feedback returned by OpenAI analysis (scores, tips, strengths, etc.)
    openai_feedback = models.JSONField(null=True, blank=True) 

    # Timestamp when the resume was uploaded
    created_at = models.DateTimeField(auto_now_add=True)  

    # UUID of the user (from Supabase authentication)
    user_id = models.UUIDField() 


    class Meta:
        db_table = "Resume_datas"
        
    def __str__(self):
        return f"{self.Resume_name}"
   
