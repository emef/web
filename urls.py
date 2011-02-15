from django.conf.urls.defaults import *
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns(
    '',
    (r'^$', 'web.home.views.index'),
    (r'^write/(?P<title>[^/]+)', 'web.blog.views.edit'),
    (r'^write', 'web.blog.views.write'),
    (r'^tag/(?P<tag>[^/]+)', 'web.blog.views.by_tag'),
    (r'^stats/', include('web.stats.urls')),
    (r'^login',
     'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    (r'^logout', 'django.contrib.auth.views.logout'),
    (r'^admin/', include(admin.site.urls)),
    (r'^(?P<title>[^/]+)', 'web.blog.views.by_title'),
)
