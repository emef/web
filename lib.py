from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.decorators import user_passes_test
from django.db.models import Count
from web.blog.models import Post, Tag
from web.stats.models import Hit
import re

def render(template, context, request):
    return render_to_response(template,
                              context,
                              context_instance=RequestContext(request))

def get_recent_posts(n):
    return Post.objects.filter(public=True).order_by('-timestamp')[:n]

def notfound(request):
    return render("home/notfound.html", {}, request)

def superuser_required(function=None, redirect_field_name=REDIRECT_FIELD_NAME):
    actual_decorator = user_passes_test(
        lambda u: u.is_superuser,
        redirect_field_name=redirect_field_name
    )
    if function:
        return actual_decorator(function)
    return actual_decorator

def get_unique_hits():
    qs = Hit.objects.distinct().values("ip", "path").order_by("path")
    pcount = {}
    for hit in qs:
        path = hit['path']
        if path in pcount:
            pcount[path] += 1
        else:
            pcount[path] = 1

    ordered = pcount.items()
    ordered.sort(key=lambda p: p[0])
    
    return ordered
