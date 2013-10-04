from django.contrib import admin


from userprofile.models import *


class PhoneInLine(admin.StackedInline):
    model = PhoneNumber
    extra = 1


class FaxInLine(admin.StackedInline):
    model = FaxNumber
    extra = 0


class LocationAdmin(admin.ModelAdmin):
    fieldsets = [ 

        ('Address',{'fields':['address1','address2','city','state','zip_code',]})
        ]
    inlines = [PhoneInLine,FaxInLine,]
    

class NamesInLine(admin.StackedInline):
    model = Name
    extra = 1



class URLInLine(admin.StackedInline):
    model = URL
    extra = 1



class EntityAdmin(admin.ModelAdmin):
    inlines = [NamesInLine,URLInLine,]
   

admin.site.register(PlanDetail)
admin.site.register(Invoice)
admin.site.register(Entity,EntityAdmin)
admin.site.register(Location,LocationAdmin)