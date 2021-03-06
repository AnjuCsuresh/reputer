# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ExtendedUser'
        db.create_table(u'userprofile_extendeduser', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True)),
            ('notification', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.NotificationLevel'], null=True, on_delete=models.SET_NULL)),
            ('stripe_customer', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('stripe_billing_type', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('plan', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
        ))
        db.send_create_signal(u'userprofile', ['ExtendedUser'])

        # Adding model 'PlanDetail'
        db.create_table(u'userprofile_plandetail', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
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
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('invoice', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('invoice_amount', self.gf('django.db.models.fields.FloatField')()),
            ('invoice_date', self.gf('django.db.models.fields.DateField')()),
            ('charged', self.gf('django.db.models.fields.FloatField')()),
        ))
        db.send_create_signal(u'userprofile', ['Invoice'])

        # Adding model 'Name'
        db.create_table(u'userprofile_name', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
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
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('location', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Location'])),
            ('number', self.gf('django.db.models.fields.CharField')(max_length=15, null=True, blank=True)),
        ))
        db.send_create_signal(u'userprofile', ['PhoneNumber'])

        # Adding model 'FaxNumber'
        db.create_table(u'userprofile_faxnumber', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('location', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Location'])),
            ('number', self.gf('django.db.models.fields.CharField')(max_length=15, null=True, blank=True)),
        ))
        db.send_create_signal(u'userprofile', ['FaxNumber'])

        # Adding model 'Location'
        db.create_table(u'userprofile_location', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
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
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Entity'])),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
        ))
        db.send_create_signal(u'userprofile', ['URL'])

        # Adding model 'Entity'
        db.create_table(u'userprofile_entity', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('live', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('entity_name', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('first_name', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('middle_name', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('last_name', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('business_name', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('profession', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['userprofile.Profession'], null=True, blank=True)),
            ('other_profession', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'], null=True, blank=True)),
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

        # Adding model 'Profession'
        db.create_table(u'userprofile_profession', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'userprofile', ['Profession'])

        # Adding M2M table for field websites on 'Profession'
        m2m_table_name = db.shorten_name(u'userprofile_profession_websites')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('profession', models.ForeignKey(orm[u'userprofile.profession'], null=False)),
            ('reviewwebsite', models.ForeignKey(orm[u'userprofile.reviewwebsite'], null=False))
        ))
        db.create_unique(m2m_table_name, ['profession_id', 'reviewwebsite_id'])

        # Adding model 'ReviewWebsite'
        db.create_table(u'userprofile_reviewwebsite', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('spider_name', self.gf('django.db.models.fields.CharField')(max_length=15)),
            ('last_run', self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'userprofile', ['ReviewWebsite'])

        # Adding model 'NotificationLevel'
        db.create_table(u'userprofile_notificationlevel', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('alive', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('level', self.gf('django.db.models.fields.IntegerField')()),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'userprofile', ['NotificationLevel'])


    def backwards(self, orm):
        # Deleting model 'ExtendedUser'
        db.delete_table(u'userprofile_extendeduser')

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

        # Deleting model 'Profession'
        db.delete_table(u'userprofile_profession')

        # Removing M2M table for field websites on 'Profession'
        db.delete_table(db.shorten_name(u'userprofile_profession_websites'))

        # Deleting model 'ReviewWebsite'
        db.delete_table(u'userprofile_reviewwebsite')

        # Deleting model 'NotificationLevel'
        db.delete_table(u'userprofile_notificationlevel')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'userprofile.entity': {
            'Meta': {'object_name': 'Entity'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'business_name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'entity_name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'live': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'location': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['userprofile.Location']", 'null': 'True', 'blank': 'True'}),
            'middle_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'other_profession': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'profession': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.Profession']", 'null': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']", 'null': 'True', 'blank': 'True'})
        },
        u'userprofile.extendeduser': {
            'Meta': {'object_name': 'ExtendedUser'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'notification': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['userprofile.NotificationLevel']", 'null': 'True', 'on_delete': 'models.SET_NULL'}),
            'plan': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'stripe_billing_type': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'stripe_customer': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['auth.User']", 'unique': 'True'})
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
        u'userprofile.notificationlevel': {
            'Meta': {'object_name': 'NotificationLevel'},
            'alive': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.IntegerField', [], {})
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