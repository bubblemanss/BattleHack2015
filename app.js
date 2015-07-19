
var http = require("http");
var express = require("express");
var fs = require('fs');
var multer = require('multer');
var app = express();

var bodyParser = require('body-parser')
var parser = require('./parser/parseHandler');
var safety, economic, transportation;
var db = {};

var returnValue = {
    neighbourhood:"", 
    neighbourhood_id: "",
    arsons: "",
    assaults: "",
    break_enter: "",
    drug_arrest: "", 
    hazardous_incidents: "",
    murders: "", 
    robberies: "",
    sexual_assaults: "",
    thefts: "",
    vechile_thefts: "",
    total_crime: "",
    ttc_stops: "",
    other_collision: "",
    traffic_collision: "",
    businesses: "",
    child_care_space: "",
    home_prices: "",
    local_employment: ""
}

app.set('port', (process.env.PORT || 5000));

parser(function(err, data){
    if (err){
        console.log(err);
    } else {
        //populate variable array with the parsed data from given back from parse.js
        safety = data[0];
        economic = data[1];
        transportation = data[2];
    }
});

var server = app.listen(app.get("port"), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/public'));
app.use(multer());
app.use(bodyParser.json());

app.post('/', function (req, res) {
    console.log(req.body);
    var neighbourhood_id = req.body.HoodId;
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    
    setReturn(neighbourhood_id);
    res.status(200).send(returnValue);
});

//this function modifies the return values lol dkm smh
function setReturn(neighbourhoodID){
	returnValue.neighbourhood = safety.neighbourhood[neighbourhoodID];
	returnValue.neighbourhood_id= safety.neighbourhood_id[neighbourhoodID];
	returnValue.arsons= safety.arsons[neighbourhoodID];
    returnValue.assaults= safety.assaults[neighbourhoodID];
    returnValue.break_enter= safety.break_enter[neighbourhoodID];
    returnValue.drug_arrest= safety.drug_arrest[neighbourhoodID]; 
    returnValue.hazardous_incidents= safety.hazardous_incidents[neighbourhoodID];
    returnValue.murders= safety.murders[neighbourhoodID];
    returnValue.robberies= safety.robberies[neighbourhoodID];
    returnValue.sexual_assaults= safety.sexual_assaults[neighbourhoodID];
    returnValue.thefts= safety.thefts[neighbourhoodID];
    returnValue.vechile_thefts= safety.vechile_thefts[neighbourhoodID];
    returnValue.total_crime= safety.total_crime[neighbourhoodID];
    returnValue.ttc_stops= transportation.ttc_stops[neighbourhoodID];
    returnValue.other_collision= transportation.other_collision[neighbourhoodID];
    returnValue.traffic_collision= transportation.traffic_collision[neighbourhoodID];
    returnValue.businesses= economic.businesses[neighbourhoodID];
    returnValue.child_care_space= economic.child_care_space[neighbourhoodID];
    returnValue.home_prices= economic.home_prices[neighbourhoodID];
    returnValue.local_employment= economic.local_employment[neighbourhoodID];
}

app.post('/inbound', function(req, res) {

    res.end();

    if (!req.body.envelope || !req.body.subject) {
        console.log('bad request');
        return;
    }

    var from = JSON.parse(req.body.envelope).from;
    var subject = req.body.subject.toLowerCase();

    if (db[from]) {
        return;
    }

    db[from] = true;

    console.log(subject);
    console.log(count+1);
});

