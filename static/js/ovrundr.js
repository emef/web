var _id="110325092";

function ajax(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 3) {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.send();
}

function update_map(lat, lng) {
    var point = new google.maps.LatLng(lat, lng);
    var map_container = document.getElementById('map');
    var options = {
        zoom: 20,
        center: point,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        // mapTypeControl: true,
        // navigationControl: true
    };

    console.log(map_container, options);
    var map = new google.maps.Map(map_container, options);

    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lng),
        draggable: false
    });
}

function update_position(id) {
    var url = '/ovrundr/loc/' + id;
    ajax(url, function(pt) {
        update_map(pt.latitude, pt.longitude);
    });
}

function check_id(username) {
    var url = '/ovrundr/live/' + username;
    ajax(url, function(live) {
        var id = live.liveActivityId;
        if (id.length) {
            update_position(id);
        }
    });
}

update_position(_id);
