from django.conf.urls import patterns, url
from records import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'grape.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    # ex: /polls/
    url(r'^$', views.index, name='index'),
    url(r'^create/', views.create, name='create'),
    #url(r'^(?P<poll_id>\d+)/$', views.detail, name='detail'),
    url(r'^list/$', views.list, name='list'),
    url(r'^add/$', views.add, name='add'),
)
