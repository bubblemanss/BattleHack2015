var map;
var pos;
var markers = [];
var infowindow = new google.maps.InfoWindow();
var previousFeature = 0;
var hoodColor = 'gray';

function initialize() {
    var mapOptions = {
        scaleControl: true,
        streetViewControl: false,
        zoom: 12
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    map.data.loadGeoJson("simple.geojson");
    console.log(map.data);
    map.data.setStyle(function(feature) {
        if (feature.getProperty('isColorful')) {
            return /** @type {google.maps.Data.StyleOptions} */({
                fillColor: hoodColor,
                strokeColor: 'gray',
                strokeWeight: 2
            });
        } else {
            return /** @type {google.maps.Data.StyleOptions} */({
                fillColor: 'gray',
                strokeColor: 'gray'
            });
        }
    });

    map.data.addListener('click', function(event) {
        var hoodNum = event.feature.getProperty("HOODNUM");
        serverLookup(hoodNum, event);
    });

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
        }, function () {
            handleNoGeolocation(true);
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

function generateContent(data) {
    content = data.neighbourhood + "<br/>"
            + "Annual crimes: " + data.total_crime + "<br/>"
            + "Home prices: $" + data.home_prices;
    return content;
}

function serverLookup(hoodId, event) {
    var url;
    if(document.location.hostname == "mmk.herokuapp.com") {
        url = "http://mmk.herokuapp.com";
    } else {
        url = "http://localhost:5000";
    }

    var data = { HoodId: hoodId };

    console.log(JSON.stringify(data));

    jQuery.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json"
    }).done(
        function(data){
            var location = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
            console.log(data);
            hoodColor = (data.total_crime < 300) ? 'green' : (data.total_crime < 700) ? 'yellow' : 'red';
            if (previousFeature != 0) {
                previousFeature.setProperty('isColorful', false);
            }
            previousFeature = event.feature;
            event.feature.setProperty('isColorful', true);
            infowindow.close();
            infowindow = new google.maps.InfoWindow({
                map: map,
                position: location,
                content: generateContent(data)
            });
            infowindow.open(map);
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
