
from django.contrib.auth.models import User
from tastypie.resources import ModelResource,ALL,ALL_WITH_RELATIONS
from tastypie.authorization import Authorization,DjangoAuthorization
from tastypie.authentication import Authentication,SessionAuthentication,ApiKeyAuthentication
from django.db import IntegrityError
from tastypie.exceptions import BadRequest
from userprofile.models import *
from stripewebhook.models import *
from tastypie import fields, utils
from django.forms.models import model_to_dict
from tastypie.resources import ModelResource,ALL, ALL_WITH_RELATIONS,fields
import stripe
import json
import datetime

class MyResource(ModelResource):
    def obj_update(self, bundle, request=None, **kwargs):
        bundle = super(MyResource, self).obj_update(bundle, **kwargs)
        for field_name in self.fields:
            field = self.fields[field_name]
            if type(field) is fields.ForeignKey and field.null and bundle.data[field_name] is None:
                setattr(bundle.obj, field_name, None)
        bundle.obj.save()
        return bundle

class UserSignUpResource(ModelResource):

  class Meta:
    
    queryset = User.objects.all()
    allowed_methods = ['post','get']
    include_resource_uri = False
    resource_name = 'newuser'
    excludes = ['is_active', 'is_staff', 'is_superuser']
    authentication = Authentication()
    authorization = Authorization()
    always_return_data = True

  def obj_create(self, bundle, request=None, **kwargs):
    try:
      #Creating the usernamme using _ instead of @ in email
        username = bundle.data['email'].replace('@','_')
        bundle.data['username'] = username
        bundle = super(UserSignUpResource, self).obj_create(bundle,**kwargs)
        bundle.obj.set_password(bundle.data.get('password'))
        print bundle.data
        bundle.obj.save()
        u = User.objects.get(username=username)
        print u
        #stripe 
        level = NotificationLevel.objects.get(level=1)
        e = ExtendedUser(user=u,notification = level)
        e.save()

    except IntegrityError:
        raise BadRequest('The email already exists')
    return bundle

  def apply_authorization_limits(self, request, object_list):
    return object_list.filter(id=request.user.id, is_superuser=True)


class LocationResource(ModelResource):
    
    class Meta:
        queryset = Location.objects.all()
        resource_name = 'Location'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'id': ALL,
        }

class PhoneResource(MyResource):
    location =fields.ForeignKey(LocationResource,'location',null=True,full=True)
    class Meta:
        queryset = PhoneNumber.objects.all()
        resource_name = 'Phone'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'id': ALL,
            'location':ALL_WITH_RELATIONS,
        }
        

    def hydrate(self, bundle):

        return bundle

class ProfessionResource(MyResource):
    class Meta:
        queryset = Profession.objects.all()
        resource_name = 'Profession'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True

class FaxResource(MyResource):
    location = fields.ForeignKey(LocationResource,'location',null=True,full=True)
    class Meta:
        queryset = FaxNumber.objects.all()
        resource_name = 'Fax'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'id': ALL,
            'location':ALL_WITH_RELATIONS,
        }







from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from tastypie.http import HttpUnauthorized, HttpForbidden
from django.conf.urls import url
from tastypie.utils import trailing_slash
from django.contrib.auth.views import password_reset
from tastypie.authorization import Authorization
import random
import string
from django.core.mail import send_mail
from django.conf import settings

class ExtendedUserResource(MyResource):
    user = fields.ToOneField('userprofile.api.UserResource','user',full=True)
    notification = fields.ForeignKey('userprofile.api.NotificationLevelResource','notification',full=True,null=True)
    class Meta: 
        queryset = ExtendedUser.objects.all()
        resource_name = 'extended_user'
        authorization = Authorization()
        authentication = Authentication()
        filtering = {
            'id':ALL,
            'username': ALL,
            'user': ALL_WITH_RELATIONS
        }
class UserResource(ModelResource):
    #extended_re = fields.ToOneField('userprofile.api.ExtendedUserResource','extended_user',full=True,null=True)
    class Meta:
        queryset = User.objects.all()
        allowed_methods = ['get', 'post','put']
        resource_name = 'user'
        authorization = Authorization()
        excludes = ['password']
        filtering = {
            'id':ALL,
            'username': ALL,
        }
    
    def prepend_urls(self):
        return [            
            url(r"^(?P<resource_name>%s)/editcard%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('editcard'), name="api_editcard"),
            url(r"^(?P<resource_name>%s)/carddetails%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('carddetails'), name="api_carddetails"),
            url(r"^(?P<resource_name>%s)/events%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('events'), name="api_events"),
            url(r"^(?P<resource_name>%s)/fullinvoices%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('fullinvoices'), name="api_fullinvoices"),
            url(r"^(?P<resource_name>%s)/invoices%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('invoices'), name="api_invoices"),
            url(r"^(?P<resource_name>%s)/updatecard%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('updatecard'), name="api_updatecard"),
            url(r"^(?P<resource_name>%s)/deletecheck%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('deletecheck'), name="api_deletecheck"),
            url(r"^(?P<resource_name>%s)/entitydelete%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('entitydelete'), name="api_entitydelete"),
            url(r"^(?P<resource_name>%s)/addcheck%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('addcheck'), name="api_addcheck"),
            url(r"^(?P<resource_name>%s)/planchange%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('planchange'), name="api_planchange"),
            url(r"^(?P<resource_name>%s)/entityadd%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('entityadd'), name="api_entityadd"),
            url(r"^(?P<resource_name>%s)/customer%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('customer'), name="api_customer"),
            url(r"^(?P<resource_name>%s)/test%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('test'), name="api_test"),
            url(r"^(?P<resource_name>%s)/login%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('login'), name="api_login"),
            url(r'^(?P<resource_name>%s)/logout%s$' %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('logout'), name='api_logout'),
            url(r'^(?P<resource_name>%s)/info%s$' %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('info'), name='api_info'),
            url(r"^(?P<resource_name>%s)/password_reset%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('password_reset'), name="api_password_reset"),
        ]
    def info(self, request, **kwargs):
        u = model_to_dict(request.user)
        del u['password']
        return self.create_response(request,u)

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

        username = data.get('username', '')
        password = data.get('password', '')

        user = authenticate(email=username, password=password)
        if user:
            if user.is_active:
                login(request, user)
                u = model_to_dict(user)
                del u['password']
                return self.create_response(request, {
                    'success': True,
                    'sessionId':request.session.session_key,
                    'user':u
                })
            else:
                return self.create_response(request, {
                    'success': False,
                    'reason': 'disabled',
                    }, HttpForbidden )
        else:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
                }, HttpUnauthorized )

    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        if request.user and request.user.is_authenticated():
            logout(request)
            return self.create_response(request, { 'success': True })
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)
    

    def password_reset(self, request, **kwargs):
        self.method_check(request, allowed=['put'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        email = data.get('email', '')
        user=User.objects.get(email=email)
        if user:
            print user
            
            a=''.join([random.choice(string.digits + string.letters) for i in range(0, 10)]) 
            print a
            user.set_password(a)
            user.save()

            #save it into the database
            # send mail
            send_mail('Password reset', ' Your new password is ' +a+ '',
               'from@example.com', [email],
               fail_silently=False)
            
            return self.create_response(request, { 'success': True ,'user':user})
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)


    def test(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

        email = data.get('email', '')
        newemail = data.get('email1', '')
        password = data.get('password', '')
        password1 = data.get('password1', '')
        user = authenticate(email=email, password=password)
        if user:
            if user.is_active:
                user1=User.objects.get(email=email)
                if user1:
                    user1.set_password(password1)
                    user1.email=newemail
                    user1.save()
            
                    return self.create_response(request, { 'success': True ,'user':user1})
                else:
                    return self.create_response(request, { 'success': False }, HttpUnauthorized)
                
            else:
                return self.create_response(request, {
                    'success': False,
                    'reason': 'disabled',
                    }, HttpForbidden )
        else:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
                }, HttpUnauthorized )
    def customer(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        plan = data.get('plan', '')
        email = data.get('email', '')
        id = data.get('id', '')
        token = data.get('token', '')
        type = data.get('type', '')
        stripe.api_key = settings.STRIPE_API_KEY
        if plan==settings.SOLO_PLAN_MONTHLY or plan==settings.SOLO_PLAN_YEARLY:
            quantity=settings.SOLO_MIN
        elif plan==settings.GROUP_PLAN_MONTHLY or plan==settings.GROUP_PLAN_YEARLY:
            quantity=settings.GROUP_MIN
        else:
            quantity=settings.LARGEGROUP_MIN
        print quantity
        customer = stripe.Customer.create(
            card=token,
            plan=plan,
            email=email,
            quantity=quantity
        )
        print customer
        extendeduser=ExtendedUser.objects.get(id=id)
        
        if extendeduser:
            extendeduser.stripe_customer=customer.id
            extendeduser.stripe_billing_type=type
            extendeduser.plan=plan
            extendeduser.save()
            return self.create_response(request, { 'success': True ,'user':extendeduser})
                
        else:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
                }, HttpUnauthorized )

    def entityadd(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        customer = data.get('customer', '')
        id= data.get('id', '')
        plan = data.get('plan', '')
        type = data.get('type', '')
        username= data.get('username', '')
        stripe.api_key = settings.STRIPE_API_KEY
        cu = stripe.Customer.retrieve(customer)
        u = User.objects.get(username=username)
        quantity=len(Entity.objects.filter(user=u,alive="true"))
        print quantity
        extendeduser=ExtendedUser.objects.get(id=id)
        
        if quantity>settings.SOLO_MIN and quantity<settings.LARGEGROUP_MIN:
            if plan==settings.GROUP_PLAN_MONTHLY or plan==settings.GROUP_PLAN_YEARLY or plan==settings.SOLO_PLAN_MONTHLY or plan==settings.SOLO_PLAN_YEARLY:
                if type=="monthly":
                    cu.plan=settings.GROUP_PLAN_MONTHLY
                    extendeduser.plan=settings.GROUP_PLAN_MONTHLY
                else:
                    cu.plan=settings.GROUP_PLAN_YEARLY
                    extendeduser.plan=settings.GROUP_PLAN_YEARLY
                cu.quantity=quantity
                cu.save()
                extendeduser.save()
            
        elif quantity>=settings.LARGEGROUP_MIN:
            if type=="monthly":
                cu.plan=settings.LGROUP_PLAN_MONTHLY
                extendeduser.plan=settings.LGROUP_PLAN_MONTHLY
            else:
                cu.plan=settings.LGROUP_PLAN_YEARLY
                extendeduser.plan=settings.LGROUP_PLAN_YEARLY
            cu.quantity=quantity
            cu.save()
            extendeduser.save()
        
        print cu
        return self.create_response(request, { 'success': True })


    def planchange(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        customer = data.get('customer', '')
        type = data.get('type', '')
        plan= data.get('plan', '')
        id = data.get('id', '')
        username= data.get('username', '')
        u = User.objects.get(username=username)
        quantity=len(Entity.objects.filter(user=u,alive="true"))
        stripe.api_key = settings.STRIPE_API_KEY
        cu = stripe.Customer.retrieve(customer)
        if plan==settings.GROUP_PLAN_MONTHLY or plan==settings.GROUP_PLAN_YEARLY:
            if quantity>=settings.LARGEGROUP_MIN:
                return self.create_response(request, {'success': False})
            elif quantity<=settings.GROUP_MIN:
                cu.quantity=settings.GROUP_MIN 
            else:
                cu.quantity=quantity
        elif plan==settings.LGROUP_PLAN_MONTHLY or plan==settings.LGROUP_PLAN_YEARLY:
            if quantity<=settings.LARGEGROUP_MIN:
                cu.quantity=settings.LARGEGROUP_MIN 
            else:
                cu.quantity=quantity
        else:
            if quantity>=settings.GROUP_MIN:
                return self.create_response(request, {'success': False})
            else:
                cu.quantity=quantity
        cu.plan=plan
        cu.save()
        print cu
        extendeduser=ExtendedUser.objects.get(id=id)
        if extendeduser:
            extendeduser.stripe_billing_type=type
            extendeduser.plan=plan
            extendeduser.save()
            return self.create_response(request, { 'success': True ,'user':extendeduser})
                
        else:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
                }, HttpUnauthorized )
                
    def addcheck(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        username= data.get('username', '')
        plan = data.get('plan', '')
        u = User.objects.get(username=username)
        l=len(Entity.objects.filter(user=u,alive="true"))+1
        print l
        if plan==settings.SOLO_PLAN_MONTHLY or plan==settings.SOLO_PLAN_YEARLY:
            if l>settings.SOLO_MIN:
                return self.create_response(request, { 'success': True ,'data':"Group"})
            
        elif plan==settings.GROUP_PLAN_MONTHLY or plan==settings.GROUP_PLAN_YEARLY:
            if l>=settings.LARGEGROUP_MIN:
                return self.create_response(request, { 'success': True ,'data':"Large Group"})
        return self.create_response(request, { 'success': True ,'data':"nochange"})

    def deletecheck(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        username= data.get('username', '')
        plan = data.get('plan', '')
        u = User.objects.get(username=username)
        l=len(Entity.objects.filter(user=u,alive="true"))-1
        print l
        if plan==settings.LGROUP_PLAN_MONTHLY or plan==settings.LGROUP_PLAN_YEARLY:
            if l<settings.LARGEGROUP_MIN:
                return self.create_response(request, { 'success': True ,'data':"Group"})
            
        elif plan==settings.GROUP_PLAN_MONTHLY or plan==settings.GROUP_PLAN_YEARLY:
            if l<settings.GROUP_MIN:
                return self.create_response(request, { 'success': True ,'data':"Solo"})
        return self.create_response(request, { 'success': True ,'data':"nochange"})

    def entitydelete(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        customer = data.get('customer', '')
        id= data.get('id', '')
        plan = data.get('plan', '')
        type = data.get('type', '')
        username= data.get('username', '')
        stripe.api_key = settings.STRIPE_API_KEY
        cu = stripe.Customer.retrieve(customer)
        u = User.objects.get(username=username)
        quantity= len(Entity.objects.filter(user=u,alive="true"))
        extendeduser=ExtendedUser.objects.get(id=id)
        print cu.subscription.plan.name
        if plan==settings.GROUP_PLAN_MONTHLY or plan==settings.GROUP_PLAN_YEARLY:
            if quantity>=settings.GROUP_MIN:
                cu.plan=plan
                extendeduser.plan=plan
            else:
                if type=="monthly":
                    cu.plan=settings.SOLO_PLAN_MONTHLY
                    extendeduser.plan=settings.SOLO_PLAN_MONTHLY
                else:
                    cu.plan=settings.SOLO_PLAN_YEARLY
                    extendeduser.plan=settings.SOLO_PLAN_YEARLY
            
        elif plan==settings.LGROUP_PLAN_MONTHLY or plan==settings.LGROUP_PLAN_YEARLY:
            if quantity>=settings.LARGEGROUP_MIN:
                cu.plan=plan
                extendeduser.plan=plan
            else:
                if type=="monthly":
                    cu.plan=settings.GROUP_PLAN_MONTHLY
                    extendeduser.plan=settings.GROUP_PLAN_MONTHLY
                else:
                    cu.plan=settings.GROUP_PLAN_YEARLY
                    extendeduser.plan=settings.GROUP_PLAN_YEARLY
        cu.quantity=quantity
        cu.save()
        extendeduser.save()
        
        print cu
        return self.create_response(request, { 'success': True })

    def updatecard(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        customerid = data.get('customer', '')
        token = data.get('token', '')
        stripe.api_key = settings.STRIPE_API_KEY
        customer = stripe.Customer.retrieve(customerid)
        cardid=customer.cards.data[0].id
        customer.cards.retrieve(cardid).delete()
        customer.cards.create(card=token)
        extendeduser = ExtendedUser.objects.get(stripe_customer=customerid)
        entities=Entity.objects.filter(user=extendeduser.user)
        for entity in entities:
            entity.live=True
            entity.save()
        extendeduser.active=True
        extendeduser.save()
        return self.create_response(request, { 'success': True})


    def invoices(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        invoice_id = data.get('invoice_id', '')
        stripe.api_key = settings.STRIPE_API_KEY
        
        lines=[]
        #invoice=stripe.Invoice.retrieve("in_1036LZ21eybl4Q7DrQ2IL53h")
        invoice=stripe.Invoice.retrieve(invoice_id)
        for data in invoice.lines.data:
            a=datetime.datetime.fromtimestamp(data["period"].start)
            b=datetime.datetime.fromtimestamp(data["period"].end)
            st = a.timetuple()
            et = b.timetuple()
            sdate=""
            edate=""
            for x in range(0, 3):
                if x!=2:
                    sdate=sdate+str(st[x])+"/"
                    edate=edate+str(et[x])+"/"
                else:
                    sdate=sdate+str(st[x])
                    edate=edate+str(et[x])
            d={
                "totalamount":data["amount"],
                "currency":data["currency"].upper(),
                "name":data["plan"].name,
                "planamount":data["plan"].amount,
                "interval":data["plan"].interval,
                "quantity":data["quantity"],
                "type":data["type"],
                "period_start":sdate,
                "period_end":edate
            }
            lines.append(d)
        c=datetime.datetime.fromtimestamp(invoice['date'])
        t = c.timetuple()
        date=""
        for x in range(0, 3):
                if x!=2:
                    date=date+str(t[x])+"/"
                else:
                    date=date+str(t[x])
        invoicelist={
            "amount_due":invoice['amount_due'],
            "date":date,
            "currency":invoice['currency'].upper(),
            "paid":invoice['paid'],
            "total":invoice['total'],
            "subtotal":invoice['subtotal'],
            "period_start":invoice['period_start'],
            "period_end":invoice['period_end'],
            "lines":lines 
        }
        return self.create_response(request, { 'success': True,"data":invoicelist})


    def fullinvoices(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        customer = data.get('customer', '')
        stripe.api_key = settings.STRIPE_API_KEY
        #a=stripe.Invoice.all(customer="cus_36LYppXykW2KGf")
        a=stripe.Invoice.all(customer=customer,count=50)
        invoices=a.data
        invoicelist=[]
        for invoice in invoices:
            a=datetime.datetime.fromtimestamp(invoice['date'])
            b=datetime.datetime.fromtimestamp(invoice['period_start'])
            c=datetime.datetime.fromtimestamp(invoice['period_end'])
            t = a.timetuple()
            st = b.timetuple()
            et = c.timetuple()
            date=""
            sdate=""
            edate=""
            for x in range(0, 3):
                if x!=2:
                    sdate=sdate+str(st[x])+"/"
                    edate=edate+str(et[x])+"/"
                    date=date+str(t[x])+"/"
                else:
                    sdate=sdate+str(st[x])
                    edate=edate+str(et[x])
                    date=date+str(t[x])
            d={
                "id":invoice['id'],
                "date":date,
                "sdate":sdate,
                "edate":edate,
                "currency":invoice['currency'].upper(),
                "total":invoice['total']
                
            }
            invoicelist.append(d)
            
        
        return self.create_response(request, { 'success': True,"data":invoicelist})


    def events(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        customer = data.get('customer', '')
        events=Event.objects.filter(customer=customer)
        eventlist=[]
        for event in events:
            data={
                "id":event.event_id,
                "display_text":event.display_text,
                "date":event.date
            }
            eventlist.reverse()
            eventlist.append(data)
            eventlist.reverse()
            
        return self.create_response(request, { 'success': True,'data':eventlist})
    


    def carddetails(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        customerid = data.get('customer', '')
        stripe.api_key = settings.STRIPE_API_KEY
        customer = stripe.Customer.retrieve(customerid)
        data={
                "id":customer.cards.data[0].id,
                "exp_month":customer.cards.data[0].exp_month,
                "exp_year":customer.cards.data[0].exp_year,
                "number":customer.cards.data[0].last4,
                "customer":customerid
        }
        return self.create_response(request, { 'success': True,"data":data})

    def editcard(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        customerid = data.get('customer', '')
        card = data.get('id', '')
        exp_month = data.get('expmonth', '')
        exp_year = data.get('expyear', '')
        stripe.api_key = settings.STRIPE_API_KEY
        customer = stripe.Customer.retrieve(customerid)
        card = customer.cards.retrieve(card)
        card.exp_year=exp_year
        card.exp_month=exp_month
        card.save()
        return self.create_response(request, { 'success': True})

        

class EntityResource(ModelResource):
    user=fields.ForeignKey(UserResource,'user',null=True,full=True)
    location =fields.ToManyField(LocationResource,'location',null=True,full=True)
    profession = fields.ForeignKey(ProfessionResource,'profession',null=True,full=True)
    class Meta:
        
        queryset = Entity.objects.all()
        resource_name = 'Entity'
        allowed_methods = ['get', 'post','put','delete']
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'id': ALL,
            'alive': ALL,
            'live':ALL,
            'user':ALL_WITH_RELATIONS,
        }
    def get_object_list(self, request): 
        return super(EntityResource, self).get_object_list(request).filter(user__id=request.user.id)
    def save_m2m(self, bundle):
        for field_name, field_object in self.fields.items():
            if not getattr(field_object, 'is_m2m', False):
                continue

            if not field_object.attribute:
                continue

            if field_object.readonly:
                continue

            # Get the manager.
            related_mngr = getattr(bundle.obj, field_object.attribute)
                # This is code commented out from the original function
                # that would clear out the existing related "Person" objects
                #if hasattr(related_mngr, 'clear'):
                # Clear it out, just to be safe.
                #related_mngr.clear()

            related_objs = []

            for related_bundle in bundle.data[field_name]:
                # See if this person already exists in the database
                try:
                    location = Location.objects.get(pk=related_bundle.obj.pk)
                # If it doesn't exist, then save and use the object TastyPie
                # has already prepared for creation
                except Location.DoesNotExist:
                    location = related_bundle.obj
                    location.save()

                related_objs.append(location)

            related_mngr.add(*related_objs)
    


    




class URLResource(MyResource):
    entity= fields.ForeignKey(EntityResource, 'entity',null=True,full=True)
    class Meta:
        queryset = URL.objects.all()
        resource_name = 'Url'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'id': ALL,
            'entity':ALL_WITH_RELATIONS,
        }
    


class NameResource(MyResource):
    entity= fields.ForeignKey(EntityResource, 'entity',full=True)
    class Meta:
        queryset = Name.objects.all()
        resource_name = 'Name'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
        filtering = {
            'id': ALL,
            'entity':ALL_WITH_RELATIONS,
        }



class NotificationLevelResource(MyResource):
    class Meta:
        queryset = NotificationLevel.objects.all()
        resource_name = 'NotificationLevel'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
       

