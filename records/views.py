from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import render
from records.models import Record

# Create your views here.
def index(request):
    return render(request, 'records/index.html', None)

def create(request):

    return render(request, 'records/create.html', None)

def add(request):
    record = Record()
    record.type = request.POST['type']
    record.userId = request.POST['userId']
    record.value = request.POST['value']
    record.time = datetime.now()
    record.save()
    return list(request)

def list(request):
    records = Record.objects.all();
    return render(request, 'records/list.html', {'records': records})