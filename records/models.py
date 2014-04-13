from django.db import models

# Create your models here.
class Record(models.Model):
    userId = models.CharField(max_length=100)
    type = models.IntegerField()
    value = models.IntegerField()
    time = models.DateTimeField()

    def __str__(self):
        return 'Record: [ type: ' + self.type + ', value : ' + self.value + ']'
