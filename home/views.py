from django.shortcuts import render_to_response
from web.lib import render, get_recent_posts

def index(request):
    posts = get_recent_posts(10)
    return render("blog/multi.html", {'posts': posts}, request)

