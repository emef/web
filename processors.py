from web.blog.models import Tag

def everypage(request):
    return { "tags": [t.keyword for t in Tag.objects.all()] }

