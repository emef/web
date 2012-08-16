var id="110325092";

function update(lat, lng) {
    var point = new google.maps.LatLng(lat, lng);
    var map_container = document.getElementById('map');
    var options = {
        zoom: 16,
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

function get_id() {
    $.ajax({
        type: 'GET',
        url: 'http://ma.ttforbes.com/ovrundr/live/NickAlexander',
        async: false,
        success: function(live) {
            console.log(live);
        }
    });
}

function get_and_update() {
    var s = $('<script>').attr('type', 'text/json').attr('src', 'http://runkeeper.com/ajax/pointData?activityId=110325092&_=1345151546825');
    $('head').append(s);
    (function() {
        window.s = s;
        if (s.text().length) {
            console.log(s.html());
        } else {
            //setTimeout(arguments.callee, 500);
        }
    })();
/*
    console.log(s);
        resp = JSON.parse(s.innerHtml);
        var points = resp.points,
        max = null;

        for (var i in points) {
            if (!max || points[i].deltaTime > max.deltaTime) {
                max = points[i];
            }
        }

        update(max.latitude, max.longitude);
*/
}

$(document).ready(function() {
    (function() {
        get_and_update();
        //setTimeout(arguments.callee, 5000);
    })();
});
