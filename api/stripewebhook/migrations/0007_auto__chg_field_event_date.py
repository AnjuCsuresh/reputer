# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Event.date'
        db.alter_column(u'stripewebhook_event', 'date', self.gf('django.db.models.fields.DateTimeField')(default=0))

    def backwards(self, orm):

        # Changing field 'Event.date'
        db.alter_column(u'stripewebhook_event', 'date', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

    models = {
        u'stripewebhook.event': {
            'Meta': {'object_name': 'Event'},
            'customer': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            'display_text': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'event_data': ('django.db.models.fields.TextField', [], {}),
            'event_id': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['stripewebhook']