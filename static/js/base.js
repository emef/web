var loaded = false;
window.onload = function() { loaded = true; };

function load_hook(fn) {
    if (loaded) {
	fn();
    } else {
	if (window.addEventListener)
	    window.addEventListener('load', fn, false);
	else if (window.attachEvent)
	    window.attachEvent('onload', fn);
	else if (window.addEvent)
	    window.addEvent('load', fn);
	else
	    setTimeout(function() { load_hook(fn); }, 10);
    }
}

load_hook(search_listeners);


function search_listeners() {
    var obj = document.getElementById("search-glass"),
	inittext;
    obj.onclick = search;

    obj = document.getElementById("search-bar");
    inittext = obj.value;
    obj.onfocus = (function(obj) {
	    return function() {
		if(obj.value == inittext) {
		    obj.value = "";
		}
		obj.onkeypress = function(e) {
		    listen_enter(e, obj);
		}
	    }
	})(obj);

    obj.onblur = (function(obj) {
	    return function() {
		if(obj.value == "") {
		    obj.value = inittext;
		}
		obj.onkeypress = null;
	    }
	})(obj);
}

function listen_enter(e, obj) {
    if (13 == (e.keyCode || e.which)) {
	obj.blur()
	search();
    }
}

function search() {
    console.log("searching");
}