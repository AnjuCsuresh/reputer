# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'Events'
        db.delete_table(u'stripewebhook_events')

        # Adding model 'Event'
        db.create_table(u'stripewebhook_event', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('event_id', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('customer', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('type', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('event_data', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'stripewebhook', ['Event'])


    def backwards(self, orm):
        # Adding model 'Events'
        db.create_table(u'stripewebhook_events', (
            ('customer', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('event_id', self.gf('django.db.models.fields.CharField')(max_length=200)),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('type', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('event_data', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'stripewebhook', ['Events'])

        # Deleting model 'Event'
        db.delete_table(u'stripewebhook_event')


    models = {
        u'stripewebhook.event': {
            'Meta': {'object_name': 'Event'},
            'customer': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'event_data': ('django.db.models.fields.TextField', [], {}),
            'event_id': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['stripewebhook']