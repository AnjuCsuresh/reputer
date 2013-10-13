# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'FaxNumber.alive'
        db.add_column(u'userprofile_faxnumber', 'alive',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Entity.alive'
        db.add_column(u'userprofile_entity', 'alive',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'URL.alive'
        db.add_column(u'userprofile_url', 'alive',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'PlanDetail.alive'
        db.add_column(u'userprofile_plandetail', 'alive',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'PhoneNumber.alive'
        db.add_column(u'userprofile_phonenumber', 'alive',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Name.alive'
        db.add_column(u'userprofile_name', 'alive',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Location.alive'
        db.add_column(u'userprofile_location', 'alive',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Invoice.alive'
        db.add_column(u'userprofile_invoice', 'alive',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'FaxNumber.alive'
        db.delete_column(u'userprofile_faxnumber', 'alive')

        # Deleting field 'Entity.alive'
        db.delete_column(u'userprofile_entity', 'alive')

        # Deleting field 'URL.alive'
        db.delete_column(u'userprofile_url', 'alive')

        # Deleting field 'PlanDetail.alive'
        db.delete_column(u'userprofile_plandetail', 'alive')

        # Deleting field 'PhoneNumber.alive'
        db.delete_column(u'userprofile_phonenumber', 'alive')

        # Deleting field 'Name.alive'
        db.delete_column(u'userprofile_name', 'alive')

        # Deleting field 'Location.alive'
        db.delete_column(u'userprofile_location', 'alive')

        # Deleting field 'Invoice.alive'
        db.delete_column(u'userprofile_invoice', 'alive')


    models = {
        u'userprofile.entity': {
            'Meta': {'object_name': 'Entity'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'entity_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['userprofile.Location']", 'symmetrical': 'False'})
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
        u'userprofile.url': {
            'Meta': {'object_name': 'URL'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Entity']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['userprofile']