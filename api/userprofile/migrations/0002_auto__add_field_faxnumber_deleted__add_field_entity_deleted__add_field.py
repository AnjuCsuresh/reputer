# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'FaxNumber.deleted'
        db.add_column(u'userprofile_faxnumber', 'deleted',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Entity.deleted'
        db.add_column(u'userprofile_entity', 'deleted',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'URL.deleted'
        db.add_column(u'userprofile_url', 'deleted',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'PlanDetail.deleted'
        db.add_column(u'userprofile_plandetail', 'deleted',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'PhoneNumber.deleted'
        db.add_column(u'userprofile_phonenumber', 'deleted',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Name.deleted'
        db.add_column(u'userprofile_name', 'deleted',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Location.deleted'
        db.add_column(u'userprofile_location', 'deleted',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)

        # Adding field 'Invoice.deleted'
        db.add_column(u'userprofile_invoice', 'deleted',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'FaxNumber.deleted'
        db.delete_column(u'userprofile_faxnumber', 'deleted')

        # Deleting field 'Entity.deleted'
        db.delete_column(u'userprofile_entity', 'deleted')

        # Deleting field 'URL.deleted'
        db.delete_column(u'userprofile_url', 'deleted')

        # Deleting field 'PlanDetail.deleted'
        db.delete_column(u'userprofile_plandetail', 'deleted')

        # Deleting field 'PhoneNumber.deleted'
        db.delete_column(u'userprofile_phonenumber', 'deleted')

        # Deleting field 'Name.deleted'
        db.delete_column(u'userprofile_name', 'deleted')

        # Deleting field 'Location.deleted'
        db.delete_column(u'userprofile_location', 'deleted')

        # Deleting field 'Invoice.deleted'
        db.delete_column(u'userprofile_invoice', 'deleted')


    models = {
        u'userprofile.entity': {
            'Meta': {'object_name': 'Entity'},
            'deleted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'entity_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['userprofile.Location']", 'symmetrical': 'False'})
        },
        u'userprofile.faxnumber': {
            'Meta': {'object_name': 'FaxNumber'},
            'deleted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Location']"}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '15', 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.invoice': {
            'Meta': {'object_name': 'Invoice'},
            'charged': ('django.db.models.fields.FloatField', [], {}),
            'deleted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'invoice': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'invoice_amount': ('django.db.models.fields.FloatField', [], {}),
            'invoice_date': ('django.db.models.fields.DateField', [], {})
        },
        u'userprofile.location': {
            'Meta': {'object_name': 'Location'},
            'address1': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'address2': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'deleted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'zip_code': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'userprofile.name': {
            'Meta': {'object_name': 'Name'},
            'alternate_name': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'common_misspellings_of_the_name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'deleted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
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
            'deleted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Location']"}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '15', 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.plandetail': {
            'Meta': {'object_name': 'PlanDetail'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'deleted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'plan_end': ('django.db.models.fields.DateField', [], {}),
            'plan_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'plan_price': ('django.db.models.fields.FloatField', [], {}),
            'plan_start': ('django.db.models.fields.DateField', [], {})
        },
        u'userprofile.url': {
            'Meta': {'object_name': 'URL'},
            'deleted': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Entity']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['userprofile']