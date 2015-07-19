
var http = require("http");
var express = require("express");
var fs = require('fs');
var app = express();
var dataGrab = require("./parser/dataReturn")
var jsonData, neighbourhood_id = 2;
var bodyParser = require('body-parser')


app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.send('Hello Malcom!');
});

var server = app.listen(app.get("port"), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.post('/', function (req, res) {
    var neighbourhood_id = req.body.HoodId;
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin" : '*',
        "Access-Control-Expose-Headers": "http://127.0.0.1:9000",
        "Content-Language":"utf-8"
    });

    dataGrab(neighbourhood_id, function(err, data) {
        console.log("Grabbing data");
        if (err){
            console.log(err);
        } else {
            jsonData = data;
            console.log(jsonData);
            res.status(200).send(jsonData);
        }
    });
    res.status(200).send(jsonData)
});
