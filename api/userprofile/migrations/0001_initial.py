# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'PlanDetail'
        db.create_table(u'userprofile_plandetail', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('plan_name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('plan_price', self.gf('django.db.models.fields.FloatField')()),
            ('plan_start', self.gf('django.db.models.fields.DateField')()),
            ('plan_end', self.gf('django.db.models.fields.DateField')()),
            ('active', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'userprofile', ['PlanDetail'])

        # Adding model 'Invoice'
        db.create_table(u'userprofile_invoice', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('invoice', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('invoice_amount', self.gf('django.db.models.fields.FloatField')()),
            ('invoice_date', self.gf('django.db.models.fields.DateField')()),
            ('charged', self.gf('django.db.models.fields.FloatField')()),
        ))
        db.send_create_signal(u'userprofile', ['Invoice'])

        # Adding model 'Name'
        db.create_table(u'userprofile_name', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alternate_name', self.gf('django.db.models.fields.CharField')(max_length=500, null=True, blank=True)),
            ('common_misspellings_of_the_name', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('school_attended1', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('school_attended2', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('previous_places_lived1', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('previous_places_worked1', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('previous_places_lived2', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('previous_places_worked2', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Entity'])),
        ))
        db.send_create_signal(u'userprofile', ['Name'])

        # Adding model 'PhoneNumber'
        db.create_table(u'userprofile_phonenumber', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('location', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Location'])),
            ('number', self.gf('django.db.models.fields.CharField')(max_length=15, null=True, blank=True)),
        ))
        db.send_create_signal(u'userprofile', ['PhoneNumber'])

        # Adding model 'FaxNumber'
        db.create_table(u'userprofile_faxnumber', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('location', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Location'])),
            ('number', self.gf('django.db.models.fields.CharField')(max_length=15, null=True, blank=True)),
        ))
        db.send_create_signal(u'userprofile', ['FaxNumber'])

        # Adding model 'Location'
        db.create_table(u'userprofile_location', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('address1', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('address2', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('city', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('zip_code', self.gf('django.db.models.fields.CharField')(max_length=10)),
        ))
        db.send_create_signal(u'userprofile', ['Location'])

        # Adding model 'URL'
        db.create_table(u'userprofile_url', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Entity'])),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
        ))
        db.send_create_signal(u'userprofile', ['URL'])

        # Adding model 'Entity'
        db.create_table(u'userprofile_entity', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('entity_name', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'userprofile', ['Entity'])

        # Adding M2M table for field location on 'Entity'
        m2m_table_name = db.shorten_name(u'userprofile_entity_location')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('entity', models.ForeignKey(orm[u'userprofile.entity'], null=False)),
            ('location', models.ForeignKey(orm[u'userprofile.location'], null=False))
        ))
        db.create_unique(m2m_table_name, ['entity_id', 'location_id'])


    def backwards(self, orm):
        # Deleting model 'PlanDetail'
        db.delete_table(u'userprofile_plandetail')

        # Deleting model 'Invoice'
        db.delete_table(u'userprofile_invoice')

        # Deleting model 'Name'
        db.delete_table(u'userprofile_name')

        # Deleting model 'PhoneNumber'
        db.delete_table(u'userprofile_phonenumber')

        # Deleting model 'FaxNumber'
        db.delete_table(u'userprofile_faxnumber')

        # Deleting model 'Location'
        db.delete_table(u'userprofile_location')

        # Deleting model 'URL'
        db.delete_table(u'userprofile_url')

        # Deleting model 'Entity'
        db.delete_table(u'userprofile_entity')

        # Removing M2M table for field location on 'Entity'
        db.delete_table(db.shorten_name(u'userprofile_entity_location'))


    models = {
        u'userprofile.entity': {
            'Meta': {'object_name': 'Entity'},
            'entity_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['userprofile.Location']", 'symmetrical': 'False'})
        },
        u'userprofile.faxnumber': {
            'Meta': {'object_name': 'FaxNumber'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Location']"}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '15', 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.invoice': {
            'Meta': {'object_name': 'Invoice'},
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
            'city': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'zip_code': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        },
        u'userprofile.name': {
            'Meta': {'object_name': 'Name'},
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
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'location': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Location']"}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '15', 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.plandetail': {
            'Meta': {'object_name': 'PlanDetail'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'plan_end': ('django.db.models.fields.DateField', [], {}),
            'plan_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'plan_price': ('django.db.models.fields.FloatField', [], {}),
            'plan_start': ('django.db.models.fields.DateField', [], {})
        },
        u'userprofile.url': {
            'Meta': {'object_name': 'URL'},
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Entity']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['userprofile']