# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Entity.first_name'
        db.add_column(u'userprofile_entity', 'first_name',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.middle_name'
        db.add_column(u'userprofile_entity', 'middle_name',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.last_name'
        db.add_column(u'userprofile_entity', 'last_name',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.business_name'
        db.add_column(u'userprofile_entity', 'business_name',
                      self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.other_profession'
        db.add_column(u'userprofile_entity', 'other_profession',
                      self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True),
                      keep_default=False)


        # Changing field 'Entity.profession'
        db.alter_column(u'userprofile_entity', 'profession_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Profession'], null=True))

        # Changing field 'Entity.entity_name'
        db.alter_column(u'userprofile_entity', 'entity_name', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

    def backwards(self, orm):
        # Deleting field 'Entity.first_name'
        db.delete_column(u'userprofile_entity', 'first_name')

        # Deleting field 'Entity.middle_name'
        db.delete_column(u'userprofile_entity', 'middle_name')

        # Deleting field 'Entity.last_name'
        db.delete_column(u'userprofile_entity', 'last_name')

        # Deleting field 'Entity.business_name'
        db.delete_column(u'userprofile_entity', 'business_name')

        # Deleting field 'Entity.other_profession'
        db.delete_column(u'userprofile_entity', 'other_profession')


        # Changing field 'Entity.profession'
        db.alter_column(u'userprofile_entity', 'profession_id', self.gf('django.db.models.fields.related.ForeignKey')(default=1, to=orm['userprofile.Profession']))

        # Changing field 'Entity.entity_name'
        db.alter_column(u'userprofile_entity', 'entity_name', self.gf('django.db.models.fields.CharField')(default=1, max_length=200))

    models = {
        u'userprofile.entity': {
            'Meta': {'object_name': 'Entity'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'business_name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'entity_name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'location': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['userprofile.Location']", 'null': 'True', 'blank': 'True'}),
            'middle_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'other_profession': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'profession': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Profession']", 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.faxnumber': {
            'Meta': {'object_name': 'FaxNumber'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Location']"}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '15', 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.invoice': {
            'Meta': {'object_name': 'Invoice'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'charged': ('django.db.models.fields.FloatField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'invoice': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'invoice_amount': ('django.db.models.fields.FloatField', [], {}),
            'invoice_date': ('django.db.models.fields.DateField', [], {})
        },
        u'userprofile.location': {
            'Meta': {'object_name': 'Location'},
            'address1': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'address2': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'zip_code': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'userprofile.name': {
            'Meta': {'object_name': 'Name'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'alternate_name': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'common_misspellings_of_the_name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Entity']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'previous_places_lived1': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'previous_places_lived2': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'previous_places_worked1': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'previous_places_worked2': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'school_attended1': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'school_attended2': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.phonenumber': {
            'Meta': {'object_name': 'PhoneNumber'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Location']"}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '15', 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.plandetail': {
            'Meta': {'object_name': 'PlanDetail'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'plan_end': ('django.db.models.fields.DateField', [], {}),
            'plan_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'plan_price': ('django.db.models.fields.FloatField', [], {}),
            'plan_start': ('django.db.models.fields.DateField', [], {})
        },
        u'userprofile.profession': {
            'Meta': {'object_name': 'Profession'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'websites': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['userprofile.ReviewWebsite']", 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.reviewwebsite': {
            'Meta': {'object_name': 'ReviewWebsite'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_run': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'spider_name': ('django.db.models.fields.CharField', [], {'max_length': '15'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        u'userprofile.url': {
            'Meta': {'object_name': 'URL'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Entity']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['userprofile']