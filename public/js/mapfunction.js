var map;
var pos;
var markers = [];
var infowindow = new google.maps.InfoWindow();
var previousFeature = 0;
var hoodColor = 'blue';
var detailData, detailLocation;

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
                strokeColor: 'blue',
                strokeWeight: 2
            });
        } else {
            return /** @type {google.maps.Data.StyleOptions} */({
                fillColor: 'blue',
                strokeColor: 'blue'
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

function showLess(){
        infowindow.close();
        infowindow = new google.maps.InfoWindow({
            map: map,
            position: detailLocation,
            content: generateInitialContent(detailData)
        });
        infowindow.open(map);
}

function generateInitialContent(data) {
    content = data.neighbourhood + "<br/>"
            + "Annual Crimes: " + data.total_crime + "<br/>"
            + "Home Prices: $" + data.home_prices +  "<br/>"+
            '<a id="myLink" href="#" onclick="showDetails();">Details...</a>';
    return content;
}

function generateDetailedContent(data) {
    content = data.neighbourhood + "<br/>"
            + "Annual crimes: " + data.total_crime + "<br/>"
            + "Arsons: " + data.arsons + "<br/>"
            + "Assaults: " + data.assaults +  "<br/>"
            + "Break and Enters: " + data.break_enter + "<br/>"
            + "Drug Arrest: " + data.drug_arrest +  "<br/>"
            + "Hazardous Incidents: " + data.hazardous_incidents + "<br/>"
            + "Murders: " + data.murders +  "<br/>"
            + "Robberies: " + data.robberies + "<br/>"
            + "Sexual Assaults: " + data.sexual_assaults + "<br/>"
            + "Thefts: " + data.thefts +  "<br/>"
            + "Vechile Thefts: " + data.vechile_thefts + "<br/>"
            + "Number of TTC stops: " + data.ttc_stops + "<br/>"
            + "Traffic Collision: " + data.traffic_collision + "<br/>"
            + "Other Collisions: " + data.other_collision + "<br/>"
            + "Businesses: " + data.businesses + "<br/>"
            + "Child Care Space: " + data.child_care_space +  "<br/>"
            + "Home Prices: " + data.home_prices + "<br/>"
            + "Local Employment: " + data.local_employment + "<br/>"
            +'<a id="myLink" href="#" onclick="showLess();">Show Less...</a>';
    return content;
}

function showDetails(){
        infowindow.close();
        infowindow = new google.maps.InfoWindow({
            map: map,
            position: detailLocation,
            content: generateDetailedContent(detailData)
        });
        infowindow.open(map);
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
            detailData = data;
            var location = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
            detailLocation = location;
            console.log("this is the data : " + data);
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
                content: generateInitialContent(data)
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
