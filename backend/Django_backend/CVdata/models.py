from __future__ import unicode_literals
from django.db import models
from mongoengine import *
# Create your models here.
connect('CV2020data', host='127.0.0.1', port=27017)

class illnessNumdata(Document):
    Area = StringField(max_length=100)
    Date = StringField(max_length=100)
    Diagnosis = StringField(max_length=100)
    Death = StringField(max_length=100)
    Cure = StringField(max_length=100)

    meta = {'collection': 'illnessNum'}
