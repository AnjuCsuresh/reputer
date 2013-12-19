# Create your views here.
from django.contrib.auth.models import User
from django.http import HttpResponse
from stripewebhook.models import *
from userprofile.models import *
import json
import stripe
import datetime

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
            if event_json['type']=="customer.card.created":
                event.display_text="Added a new "+event_json['data']['object']['type']+" ending in "+event_json['data']['object']['last4']
            elif event_json['type']=="invoice.payment_succeeded":
                event.display_text="Your invoice for "+event_json['data']['object']['currency']+" "+str(event_json['data']['object']['total'])+" was paid"
            elif event_json['type']=="customer.subscription.updated":
                if "plan" in event_json['data']['previous_attributes']:
                    event.display_text="Your plan changed from "+event_json['data']['previous_attributes']['plan']['name']+" to "+event_json['data']['object']['plan']['name']
                else:
                    event.display_text="Your subscription has changed"
            elif event_json['type']=="customer.card.deleted":
                event.display_text="Deleted a "+event_json['data']['object']['type']+" ending in "+event_json['data']['object']['last4']
            elif event_json['type']=="invoice.created":
                event.display_text="You has a new invoice for "+event_json['data']['object']['currency']+" "+str(event_json['data']['object']['total'])
            elif event_json['type']=="customer.card.updated":
                event.display_text="Updated a "+event_json['data']['object']['type']+" ending in "+event_json['data']['object']['last4']
            elif event_json['type']=="invoiceitem.updated":
                event.display_text="Your invoice item was invoiced"
            elif event_json['type']=="customer.subscription.created":
                event.display_text="Subscribed to the "+event_json['data']['object']['plan']['name']+" plan"
            elif event_json['type']=="charge.failed":
                event.display_text="Your card has expired"
                extendeduser = ExtendedUser.objects.get(stripe_customer=event_json['data']['object']['customer'])
                entities=Entity.objects.filter(user=extendeduser.user)
                for entity in entities:
                    entity.live=False
                    entity.save()
                extendeduser.active=False
                extendeduser.save()
            else:
                event.display_text=event_json['type']
            event.event_data=event_json['data']
            event.date=event_json['created']
            a=datetime.datetime.fromtimestamp(event_json['created'])
            t = a.timetuple()
            event.date=""
            for x in range(0, 3):
                if x!=2:
                    event.date=event.date+str(t[x])+"/"
                else:
                    event.date=event.date+str(t[x])
            event.save()
        if event_json['data']['object']['object']=="customer":
            event.customer=event_json['data']['object']['id']
            event.type=event_json['type']
            if event_json['type']=="customer.updated":
                if event_json['data']['previous_attributes']['default_card']==None:
                    event.display_text="Your details were updated"
                else:
                    event.display_text="Your default credit card changed"
            elif event_json['type']=="customer.created":
                event.display_text="You are a new customer"
            event.event_data=event_json['data']
            a=datetime.datetime.fromtimestamp(event_json['created'])
            t = a.timetuple()
            event.date=""
            for x in range(0, 3):
                if x!=2:
                    event.date=event.date+str(t[x])+"/"
                else:
                    event.date=event.date+str(t[x])
            event.save()

        return HttpResponse('success')
