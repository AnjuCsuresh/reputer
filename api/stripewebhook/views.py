# Create your views here.
from django.contrib.auth.models import User
from django.http import HttpResponse
from stripewebhook.models import *
import json
import stripe

def webhook(request):
    
    if request.method == 'POST':
        stripe.api_key ="sk_test_8a4R0xmqlVFFuQsfk3XjHpO5"  
        event_json = json.loads(request.body)
        event=Event()
        event.event_id=event_json['id']
        event.customer=event_json['data']['object']['customer']
        event.type=event_json['type']
        event.event_data=event_json['data']
        event.save()
        return HttpResponse('success')
