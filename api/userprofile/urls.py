from django.conf.urls import patterns, url
from django.contrib.auth.views import *


urlpatterns = patterns('userprofile.views',
   url(
       r'^webhook/$', 
       'webhook', 
       name="webhook"
   ),
   
   
)