from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from web.stats.models import Hit
from web.lib import render, get_unique_hits, superuser_required

@login_required
def index(request):
   pcount = get_unique_hits() 
   return render("stats/stats.html",
                 { "pcount": pcount },
                 request)


def track(request):
    if all(k in request.GET for k in ("referrer", "path")):
        referrer = request.GET["referrer"]
        path = request.GET["path"].lower()
        ip = request.META["REMOTE_ADDR"]

        h = Hit(ip=ip, referrer=referrer, path=path)
        h.clean_path()
        h.save()

    return HttpResponse("")

@superuser_required
def remove(request):
    if "path" in request.POST:
        for h in Hit.objects.filter(path=request.POST["path"]):
            h.delete()
    return HttpResponse("hello")
            
