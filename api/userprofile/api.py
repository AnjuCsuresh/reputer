from django.contrib.auth.models import User
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization,DjangoAuthorization
from tastypie.authentication import Authentication,SessionAuthentication,ApiKeyAuthentication
from django.db import IntegrityError
from tastypie.exceptions import BadRequest
from userprofile.models import *
from tastypie import fields, utils
from django.forms.models import model_to_dict
from tastypie.resources import ModelResource,ALL, ALL_WITH_RELATIONS,fields


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
      bundle = super(UserSignUpResource, self).obj_create(bundle,**kwargs)
      bundle.obj.set_password(bundle.data.get('password'))
      bundle.obj.save()
    except IntegrityError:
      raise BadRequest('The username already exists')
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

class PhoneResource(MyResource):
    location =fields.ForeignKey(LocationResource,'location',null=True,full=True)
    class Meta:
        queryset = PhoneNumber.objects.all()
        resource_name = 'Phone'
        authentication = Authentication()
        authorization = Authorization()
        

    def hydrate(self, bundle):

        return bundle

class ProfessionResource(MyResource):
    class Meta:
        queryset = Profession.objects.all()
        resource_name = 'Profession'
        authentication = Authentication()
        authorization = Authorization()

class FaxResource(MyResource):
    location = fields.ForeignKey(LocationResource,'location',null=True,full=True)
    class Meta:
        queryset = FaxNumber.objects.all()
        resource_name = 'Fax'
        authentication = Authentication()
        authorization = Authorization()





class EntityResource(ModelResource):
    location =fields.ToManyField(LocationResource,'location',null=True,full=True)
    profession = fields.ForeignKey(ProfessionResource,'profession',null=True,full=True)
    class Meta:
        queryset = Entity.objects.all()
        resource_name = 'Entity'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
    
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
    


class NameResource(MyResource):
    entity= fields.ForeignKey(EntityResource, 'entity',full=True)
    class Meta:
        queryset = Name.objects.all()
        resource_name = 'Name'
        authentication = Authentication()
        authorization = Authorization()
        always_return_data = True




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

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        
        allowed_methods = ['get', 'post','put']
        resource_name = 'user'
        authorization = Authorization()
        filtering = {
             'username': ALL,
        }
    def hydrate(self, bundle):
        if bundle.data.password:
            u = User(username=bundle.data['username'])
            u.set_password(bundle.data['password'])
            bundle.data['password'] = u.password
        return bundle
    def prepend_urls(self):
        return [
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

        user = authenticate(username=username, password=password)
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
        user=User.objects.filter(email=email)
        if user:
            print type(user)
            #random password generation
            a=''.join([random.choice(string.digits + string.letters) for i in range(0, 10)]) 
            #save it into the database
            # send mail
            send_mail('Subject here', 'Go to the link for reset your password http://localhost:5000/#/reset/',
               'from@example.com', ['manjusha.b70@gmail.com'],
               fail_silently=False)
            print a
            return self.create_response(request, { 'success': True })
        else:
            return self.create_response(request, { 'success': False }, HttpUnauthorized)
