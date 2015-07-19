
var http = require("http");
var express = require("express");
var fs = require('fs');
var multer = require('multer');
var Pusher = require('pusher');
var escapeHTML = require('escape-html');
var twilio = require('twilio');
var app = express();

var bodyParser = require('body-parser')
var parser = require('./parser/parseHandler');
var safety, economic, transportation;
var db = {};

var pusher = new Pusher({
   appId: '130754',
   key: '3e19eae4407129f62cdb',
   secret: '7199c2c544a3614f56c2'
});

pusher.trigger('my_channel', 'my_event', {
   message: "hello world"
});

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

    // if (!req.body.envelope || !req.body.subject) {
    //     console.log('bad request');
    //     return;
    // }

    console.log(JSON.parse(req.body.envelope));
    console.log(req.body);
    // var subject = req.body.subject.toLowerCase();

    // if (db[from]) {
    //     return;
    // }

    // db[from] = true;
    subject = req.body.subject;
    var emailSubject = subject.match(/Security|Transportation|Economic/i);
    if (emailSubject!=null){//Subject matches wanted form
        var emailBody = req.body.text;
        
        emailBody = emailBody.split(/\r\n|\r|\n/g);
        //emailBody = emailBody.split("\r\n");
        if (emailBody.length > 0 ){
            console.log("Neighbourhood: " + emailBody[0]);
            var emailBodyTwo = emailBody[1];
            if (emailBodyTwo.match(/collision|arson|assault|break|drug|murder|robber|theft/i)!=null){
                console.log("Increase in :" + emailBodyTwo);
                crimeplusplus(emailBody[0], emailBodyTwo);
            }
        }
    }

});

function crimeplusplus (neighbourhoodName, body){
    console.log("FUCKK");

    // There's always only 140 ids
    for (var i = 1; i < 141 ; i++){

        if (safety.neighbourhood[i].toLowerCase() == neighbourhoodName.toLowerCase().replace(/\s+/g, '')){
            var crime = parseInt(safety.total_crime[i]);
            crime ++;
                if (body.toLowerCase().replace(/\s+/g, '') == "collision") {
                    var add = parseInt(transportation.traffic_collision[i]);
                    add++;
                    transportation.traffic_collision[i] = add;
                    crime--;
                    console.log(add);
                }
                else if (body.toLowerCase().replace(/\s+/g, '') == "break") {
                    var add = parseInt(safety.break_enter[i]);
                    add++;
                    safety.break_enter[i] = add;
                    console.log(add);
                }
                else if (body.toLowerCase().replace(/\s+/g, '') == "drug") {
                    var add = parseInt(safety.drug_arrest[i]);
                    add++;
                    safety.drug_arrest[i] = add;
                    console.log(add);
                }
                else if (body.toLowerCase().replace(/\s+/g, '') == "arson") {
                    var add = parseInt(safety.arsons[i]);
                    add++;
                    safety.arsons[i].arsons = add;
                    console.log(add);
                }
                else if (body.toLowerCase().replace(/\s+/g, '') == "assault") {
                    var add = parseInt(safety.assaults[i]);
                    add++;
                    safety.assaults[i] = add;
                    console.log(add);
                }
                else if (body.toLowerCase().replace(/\s+/g, '') == "murder") {
                    var add = parseInt(safety.murders[i]);
                    add++;
                    safety.murders[i] = add;
                    console.log(add);
                }
                else if (body.toLowerCase().replace(/\s+/g, '') == "theft") {
                    var add = parseInt(safety.thefts[i]);
                    add++;
                    safety.thefts[i] = add;
                    console.log(add);
                }
                else if (body.toLowerCase().replace(/\s+/g, '') == "robber") {
                    var add = parseInt(safety.robberies[i]);
                    add++;
                    safety.robberies[i] = add;
                    console.log(add);
                }

                safety.total_crime[i] = crime;
            }
    }


app.use(bodyparser.urlencoded());
app.post('/sms', twilio.webhook({
        validate:false
    }), function(req, res) {
        console.log(req.body.Body);
        var smsBody = req.body.Body.split(/\r\n|\r|\n/g);
        crimeplusplus(smsBody[0], smsBody[1]);
});


    
    pusher.trigger('notifications', 'new_notification', {
        message: body.replace(/\s+/g, '') + " occurred in " + neighbourhoodName.replace(/\s+/g, '')
    });
}
