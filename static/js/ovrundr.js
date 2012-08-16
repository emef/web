var user = window.location.search.substring(1) || 'NickAlexander'
  , map_container = document.getElementById('map')
  , map = new google.maps.Map(map_container, {
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    })
  , marker = new google.maps.Marker({
        map: map,
        draggable: false
    });

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
    marker.setPosition(point);
    map.setCenter(point);
}

function update_position(id) {
    var url = '/ovrundr/loc/' + id;
    ajax(url, function(pt) {
        update_map(pt.latitude, pt.longitude);
    });
}

function check_and_update(username) {
    var url = '/ovrundr/live/' + username;
    ajax(url, function(live) {
        var id = live.liveActivityId;
        if (id.length) {
            update_position(id);
        }
    });
}

(function() {
    check_and_update(user);
    setTimeout(arguments.callee, 1000 * 3);
})();
