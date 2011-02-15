load_hook(tags_init);

function tags_init() {
    var select = document.getElementById("id_tag");
    
    select.onchange = function(e) {
	listen_new(select);
    }

    for(var i=0; i < tags.length; i++) {
	add_tag(tags[i]);
    }

    add_tag("New Tag", "");

}

var add_tag = (function() {
	var select = document.getElementById("id_tag");
	
	return function(name, val) {
	    var option = document.createElement("option");
	    
	    if (val == null) {
		val = name;
	    }

	    option.setAttribute("value", val);
	    option.innerHTML = name;

	    select.appendChild(option);
	}
    })();

    

function listen_new(select) {
    if (select.options[select.selectedIndex].value != "") {
	return;
    }

    var text = document.createElement("input");
    text.setAttribute("type", "text");
    text.setAttribute("name", "tag");
    text.setAttribute("id", "id_tag");
    select.parentNode.replaceChild(text, select);

}