var map;
var pos;
var markers = [];
var infowindow = new google.maps.InfoWindow();

function initialize() {
    var mapOptions = {
        scaleControl: true,
        streetViewControl: false,
        zoom: 16
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    map.data.loadGeoJson("simple.geojson");
    map.data.setStyle(function(feature) {
        var color = 'gray';
        if (feature.getProperty('isColorful')) {
          color = feature.getProperty('color');
        }
        return /** @type {google.maps.Data.StyleOptions} */({
          fillColor: color,
          strokeColor: color,
          strokeWeight: 2
        });
    });

    map.data.addListener('click', function(event) {
        var location = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());

        infowindow.close();
        infowindow = new google.maps.InfoWindow({
            map: map,
            position: location,
            content: "TEST"
        });
        infowindow.open(map);

        event.feature.setProperty('isColorful', true);
    });

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
            markers.push(marker);

            map.setCenter(pos);
        },function () {
            handleNoGeolocation(true);
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

function displayInfoWindow(event) {
    if (event.feature == undefined) return;
    //var infowindow = {};
    console.log("Display info window");
    var lat = event.latLng;
    var location = new google.maps.LatLng(lat);

    infowindow.map = map;
    infowindow.position = position;
    infowindow.content = "Test";
    infowindow.open(map);
    event.feature.setProperty('isColorful', true);
}

/*

function serverLookup(event){
    //var url = "http://localhost:8080/lookup";
    var url = "http://uwstudygroup.herokuapp.com/lookup";

    event.preventDefault();
    var code = document.getElementById("code").value;

    var formData = {};
    formData.code = code;

    jQuery.ajax({
        type:"POST",
        url:url,
        data:JSON.stringify(formData),
        dataType:"json",
        contentType: "application/json"
    }).done(
        function(data){
            console.log(data);
            clearMarkers();
            for(var i = 0; i < data.length; i++){
                addMarker(data[i]);
            }
        }
    ).fail(
        function(data){
            console.log('err');
            console.log(JSON.stringify(data));
            console.log(data.status);
            console.log(data.statusMessage);
        }
    );
}

function serverCreate(event){
    //var url = "http://localhost:8080/create";
    var url = "http://uwstudygroup.herokuapp.com/create";

    event.preventDefault();
    var code = document.getElementById("code").value;
    var building = document.getElementById("building").value;
    var room = document.getElementById("room").value;
    var people = document.getElementById("people").value;

    var formData = {};
    formData.code = code;
    formData.building = building;
    formData.room = room;
    formData.people = people;

    jQuery.ajax({
        type:"POST",
        url:url,
        data:JSON.stringify(formData),
        dataType:"json",
        contentType: "application/json"
    }).done(
        function(data){
            console.log(data);
        }
    ).fail(
        function(data){
            console.log('err');
            console.log(JSON.stringify(data));
            console.log(data.status);
            console.log(data.statusMessage);
        }
    );
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}
*/
google.maps.event.addDomListener(window, 'load', initialize);
