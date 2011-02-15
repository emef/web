from django.conf.urls.defaults import *

urlpatterns = patterns('web.stats.views',
    (r'^$', 'index'),
    (r'^track', 'track'),
    (r'^remove', 'remove'),
)
                       
