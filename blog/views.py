from django.http import HttpResponseRedirect
from web.lib import render, superuser_required, notfound
from web.blog.models import PostForm, Tag, Post

@superuser_required
def write(request):
    if "POST" == request.method:
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save()
            return HttpResponseRedirect("/" + post.title)
        else:
            form.non_field_errors = "Invalid"
    else:
        form = PostForm()
    return render("blog/write.html", {'form': form}, request)

@superuser_required
def edit(request, title):
    
    #get the post for this title
    post = None
    try:
        post = Post.objects.get(title__iexact=title)
    except Post.DoesNotExist:
        return HttpResponseRedirect("/notfound")
    
    if "POST" == request.method:

        #save the post with changes from form
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save()
            post.save()
            return HttpResponseRedirect("/%s" % (post.title))
        else:
            form.non_field_errors = "Invalid"

    else:
        form = PostForm(instance=post)
    return render("blog/write.html", {'form': form}, request)
                
def by_tag(request, tag):
    posts = Post.objects.filter(tags__keyword__iexact=tag)
    return render("blog/multi.html", {'posts': posts}, request)
    
def by_title(request, title):
    try:
        post = Post.objects.get(title__iexact=title)
        return render("blog/single.html", {'post': post}, request)
    except Post.DoesNotExist:
        return notfound(request)
