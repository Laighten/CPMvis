from django.contrib import admin
from django.urls import path,include,re_path
from django.conf.urls import url
from .views import *

urlpatterns = [
    path('illnessNum', illnessNumListView.as_view({'get': 'list'}), name='illnessNum'),
]