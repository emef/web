from django.db import models
import re

class Hit(models.Model):
    timestamp = models.DateTimeField(auto_now=True)
    ip = models.IPAddressField()
    path = models.URLField(max_length=300)
    referrer = models.URLField(max_length=300)

    def __unicode__(self):
        return "%s: %s" % (self.ip, self.path)

    def clean_path(self):
        pat = re.compile(r'(?:http://)?(?:www.)?(?P<path>[\w\s+-.\/]+)[\/]*')
        p = pat.match(self.path).group('path')
        if p[-1:] == '/':
            p = p[:-1]
        self.path = p

        


