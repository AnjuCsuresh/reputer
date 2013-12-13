from django.conf.urls import patterns, url
from django.contrib.auth.views import *


urlpatterns = patterns('stripewebhook.views',
   url(
       r'^webhook/$', 
       'webhook', 
       name="webhook"
   ),
   
   
)