from django.http import HttpResponse
from django.shortcuts import render_to_response
from web.lib import render, get_recent_posts

def index(request):
    posts = get_recent_posts(10)
    return render("blog/multi.html", {'posts': posts}, request)

def ovrundr(request, username):
    url_fmt = 'http://runkeeper.com/user/%s/ajax/liveActivityCheck'
    live = simplejson.loads(urllib.urlopen(url_fmt % username).read())
    return HttpResponse(live, mimetype='text/json')

def loc(request, id):
    pass
