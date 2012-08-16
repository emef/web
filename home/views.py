from django.http import HttpResponse
from django.shortcuts import render_to_response
from web.lib import render, get_recent_posts
import simplejson, urllib

def index(request):
    posts = get_recent_posts(10)
    return render("blog/multi.html", {'posts': posts}, request)

def ovrundr(request, username):
    url_fmt = 'http://runkeeper.com/user/%s/ajax/liveActivityCheck'
    live = urllib.urlopen(url_fmt % username).read()
    return HttpResponse(live, mimetype='application/json')

def loc(request, id):
    url_fmt = 'http://runkeeper.com/ajax/pointData?activityId=%s'
    data = simplejson.loads(urllib.urlopen(url_fmt % id).read())
    points = data['points']
    max_pt = points[0]
    for point in points:
        if (point['type]' == 'TripPoint') and (point['deltaTime'] > max_pt['deltaTime']):
            max_pt = point
    return HttpResponse(simplejson.dumps(max_pt), mimetype='application/json')
