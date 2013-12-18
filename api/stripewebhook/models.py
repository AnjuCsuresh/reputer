
from django.db import models

class Event(models.Model):
    event_id= models.CharField(max_length=200)
    customer= models.CharField(max_length=200,null=True,blank=True)
    type= models.CharField(max_length=200,null=True,blank=True)
    event_data = models.TextField()
    display_text=models.CharField(max_length=200,null=True,blank=True)

# Create your models here.
