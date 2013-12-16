
from django.db import models

class Event(models.Model):
    event_id= models.CharField(max_length=200)
    customer= models.CharField(max_length=200,null=True,blank=True)
    type= models.CharField(max_length=200,null=True,blank=True)
    event_data = models.TextField()

# Create your models here.
