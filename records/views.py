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
    records = Record.objects.all()
    poop = {1: '少', 2: '一般', 3: '多', 4: '巨大'}
    for record in records:
        if record.type == 2:
            record.value = poop[record.value];
    return render(request, 'records/list.html', {'records': records})