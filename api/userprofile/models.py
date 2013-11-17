from django.db import models
from django.contrib.auth.models import User
from django.db.models.query import QuerySet

class LiveField(models.Field):
    '''Similar to a BooleanField, but stores False as NULL.

    '''
    description = 'Soft-deletion status'
    __metaclass__ = models.SubfieldBase

    def __init__(self):
        super(LiveField, self).__init__(default=True, null=True)

    def db_type(self, connection):
        # This is MySQL-specific.
        return 'tinyint(1) DEFAULT 1'

    def get_prep_value(self, value):
        # Convert in-Python value to value we'll store in DB
        if value:
            return 1
        else:
            return None

    def to_python(self, value):
        # Misleading name, since type coercion also occurs when
        # assigning a value to the field in Python.
        return bool(value)

class SoftDeletionQuerySet(QuerySet):
    def delete(self):
        # Bulk delete bypasses individual objects' delete methods.
        return super(SoftDeletionQuerySet, self).update(alive=False)

    def hard_delete(self):
        return super(SoftDeletionQuerySet, self).delete()


class SoftDeletionManager(models.Manager):
    # Use this for foreign key lookups, too.
    use_for_related_fields = True

    def __init__(self, *args, **kwargs):
        self.live_only = kwargs.pop('live_only', True)
        super(SoftDeletionManager, self).__init__(*args, **kwargs)

    def get_queryset(self):
        if self.live_only:
            return SoftDeletionQuerySet(self.model).filter(alive=True)
        return SoftDeletionQuerySet(self.model)

    def hard_delete(self):
        return self.get_queryset().hard_delete()


class SoftDeletionModel(models.Model):
    alive = models.BooleanField(default=True)

    objects = SoftDeletionManager()
    kb = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    class Meta:
        abstract = True

    def delete(self):
        self.alive = False
        self.save()

    def hard_delete(self):
        super(SoftDeletionModel, self).delete()

class ExtendedUser(SoftDeletionModel):
    user = models.OneToOneField(User)
    notification = models.ForeignKey('NotificationLevel',on_delete=models.SET_NULL,null=True)

    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

class PlanDetail(SoftDeletionModel):
    plan_name = models.CharField(max_length=200)
    plan_price = models.FloatField()
    plan_start = models.DateField()
    plan_end = models.DateField()
    active = models.BooleanField(default=False)
    
    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return self.plan_name


class Invoice(SoftDeletionModel):
    invoice = models.CharField(max_length=200)
    invoice_amount = models.FloatField()
    invoice_date = models.DateField()
    charged = models.FloatField()
    
    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return self.invoice


class Name(SoftDeletionModel):
    
    alternate_name = models.CharField(max_length=500,null=True,blank=True)
    common_misspellings_of_the_name = models.CharField(max_length=200,null=True,blank=True)
    school_attended1 = models.CharField(max_length=200,null=True,blank=True)
    school_attended2 = models.CharField(max_length=200,null=True,blank=True)
    previous_places_lived1 = models.CharField(max_length=200,null=True,blank=True)
    previous_places_worked1 = models.CharField(max_length=200,null=True,blank=True)
    previous_places_lived2 = models.CharField(max_length=200,null=True,blank=True)
    previous_places_worked2 = models.CharField(max_length=200,null=True,blank=True)
    entity = models.ForeignKey('Entity')
    
    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return self.alternate_name



class PhoneNumber(SoftDeletionModel):
    location = models.ForeignKey('Location')
    number = models.CharField(max_length=15, null=True, blank=True)
    
    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return self.number



class FaxNumber(SoftDeletionModel):
    location = models.ForeignKey('Location')
    number = models.CharField(max_length=15,null=True,blank=True)
    
    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return self.number



class Location(SoftDeletionModel):

    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    zip_code = models.CharField(max_length=10)
    
    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return self.address1 + "," + self.address2 + "," + self.city + ", " + self.state + ", " + self.zip_code




class URL(SoftDeletionModel):
    entity = models.ForeignKey('Entity')
    url = models.URLField()    

    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return self.url


class Entity(SoftDeletionModel):
    live = models.BooleanField(default=False)
    entity_name = models.CharField(max_length=200,null=True,blank=True)
    first_name = models.CharField(max_length=50,null=True,blank=True)
    middle_name = models.CharField(max_length=50,null=True,blank=True)
    last_name = models.CharField(max_length=50,null=True,blank=True)
    business_name = models.CharField(max_length=200,null=True,blank=True)
    location = models.ManyToManyField(Location,null=True,blank=True)
    profession = models.ForeignKey('Profession',null=True,blank=True)
    other_profession = models.CharField(max_length=200,null=True,blank=True)
    user = models.ForeignKey('auth.User',null=True,blank=True)
    
    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        if not self.entity_name:
            if self.first_name:
                return self.first_name
            elif self.business_name:
                return self.business_name

        return "Unamed Entity"

class Profession(SoftDeletionModel):
    name = models.CharField(max_length=200)
    websites = models.ManyToManyField('ReviewWebsite',blank=True,null=True)

    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return self.name
        
class ReviewWebsite(SoftDeletionModel):
    name =  models.CharField(max_length=200)
    url = models.URLField()
    spider_name = models.CharField(max_length=15)
    last_run = models.DateTimeField(blank=True,null=True)

    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)
    
    def __unicode__(self):
        return self.name

class NotificationLevel(SoftDeletionModel):
    level = models.IntegerField()
    description = models.CharField(max_length=200)

    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(live_only=False)

    def __unicode__(self):
        return str(self.level)
