from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

# For API
from tastypie.api import Api
from userprofile.api import *
#Register API Enpoints and resources
v1_api = Api(api_name='v1')
v1_api.register(UserSignUpResource())
v1_api.register(EntityResource())
v1_api.register(LocationResource())
v1_api.register(PhoneResource())
v1_api.register(FaxResource())
v1_api.register(NameResource())
v1_api.register(URLResource())
v1_api.register(UserResource())
v1_api.register(ProfessionResource())
v1_api.register(NotificationLevelResource())
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'cubator.views.home', name='home'),
    #url(r'^userprofile/', include('userprofile.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^userprofile/', include('django.contrib.auth.urls') ),
    (r'^userprofile/password/reset/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 'django.contrib.auth.views.password_reset_confirm', 
        {'post_reset_redirect' : '/userprofile/reset/'}),
    
    url(r'^admin/', include(admin.site.urls)),
	url(r'^api/', include(v1_api.urls)),
	url(r'^userprofile/', include('userprofile.urls',namespace="userprofile"))

)