from django.conf.urls import patterns, url
from django.contrib.auth.views import *


urlpatterns = patterns('userprofile.views',
   url(
       r'^forgot-password/$', 
       'forgot_password', 
       name="forgot-password"
   ),
   url(
       r'^password/$','password', 
       name="password"
   ),
   url(
       r'^reset/$','resetdone', 
       name="resetdone"
   ),
   
)