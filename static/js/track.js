(function(referrer, path) {
    var s = document.createElement("script"),
        src = "http://ma.ttforbes.com/stats/track?referrer="+referrer+"&path="+path;
    s.setAttribute("src", src);
    document.getElementsByTagName("head")[0].appendChild(s);
})(document.referrer, window.location.href);
     