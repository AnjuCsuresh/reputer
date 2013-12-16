# Create your views here.
from django.contrib.auth.models import User
from django.http import HttpResponse
from stripewebhook.models import *
from userprofile.models import *
import json
import stripe

def webhook(request):
    
    if request.method == 'POST':
        stripe.api_key ="sk_test_8a4R0xmqlVFFuQsfk3XjHpO5"  
        event_json = json.loads(request.body)
        print event_json
        event=Event()
        event.event_id=event_json['id']
        if "customer" in event_json['data']['object']:
            event.customer=event_json['data']['object']['customer']
            event.type=event_json['type']
            event.event_data=event_json['data']
            event.save()
            if event_json['type']=="charge.failed":
                extendeduser = ExtendedUser.objects.get(stripe_customer=event_json['data']['object']['customer'])
                entities=Entity.objects.filter(user=extendeduser.user)
                for entity in entities:
                    entity.live=False
                    entity.save()
                extendeduser.active=False
                extendeduser.save()
        return HttpResponse('success')
