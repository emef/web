var api = {};
(function(api) {
    function map_by_class(node, class_name, fn) {
        var pat = new RegExp(class_name);
        if (pat.test(node.className)) fn(node);
        for (var i=0, j=node.children.length; i<j; i++) {
            map_by_class(node.children[i], class_name, fn);
        }
    }

    function remove(node) {
        var path = node.children[1].innerHTML;
        ajax("/stats/remove",
             "POST",
             { path: path },
             function(r) {
                 console.log(r)
                 node.parentNode.removeChild(node);
             });
    }
    
    api.remove = remove;
    api.map = map_by_class;
})(api);

function ajax(url, method, data, callback) {
    var obj = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
    if (typeof (callback) == "function") {
	obj.onreadystatechange = function () {
	    if (obj.readyState == 4 && obj.status == 200) {
	        callback(this.responseText);
	    }
	}
    }
    
    var args = "",
    first = true;
    for (i in data) {
	if (first) first = false;
	else args += "&";
	args += i + "=";
	if(typeof(data[i]) == 'object') {
	    args += escape(JSON.stringify(data[i]));
	} else { 
	    args += data[i];
	}
    }
    
    obj.open(method, url, true);
    obj.setRequestHeader('X_REQUESTED_WITH', 'XMLHttpRequest');
    obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    obj.send(args);
}

window.onload = function() {
    var stats = document.getElementById("stats");
    api.map(stats, "stat", function(node) {
        var r = document.createElement("span"),
            path = node.firstChild;
        r.innerHTML = "x";
        r.style.cursor = "pointer";
        r.onclick = (function(node) {
            return function() {
                api.remove(node);
            }
        })(node);
        node.insertBefore(r, path);
    });
}