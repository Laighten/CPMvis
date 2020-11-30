from rest_framework_mongoengine import serializers
from mongoengine import *
from . import models

class illnessNumSerializer(serializers.DocumentSerializer):
    class Meta:
        model = models.illnessNumdata
        fields = '__all__'