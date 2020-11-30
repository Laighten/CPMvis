import pymongo
from django.http import HttpResponse, JsonResponse
from bson.json_util import dumps
from . import models
from . import serializers
from rest_framework_mongoengine import generics, viewsets
from django.shortcuts import render

# Create your views here.
class illnessNumListView(viewsets.ModelViewSet):
    def list(self, request, format=None):
        if request.method == 'GET':
            data_list = []
            key = ['Area', 'Date', 'Diagnosis','Death','Cure']
            qs = models.illnessNumdata.objects.all()
            for i in qs:
                data = []
                data.append(i.Area)
                data.append(i.Date)
                data.append(i.Diagnosis)
                data.append(i.Death)
                data.append(i.Cure)
                dic = dict(zip(key, data))
                data_list.append(dic)
            return JsonResponse(
                data_list, safe=False
            )