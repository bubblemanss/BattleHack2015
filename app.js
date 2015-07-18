
var http = require("http");
var express = require("express");
var fs = require('fs');
var app = express();
var dataGrab = require("./parser/dataReturn")
var jsonData, neighbourhood_id = 2;

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

app.post('/', function (req, res) {
	res.set({
	    "Content-Type": "application/json",
	    "Access-Control-Allow-Origin": "*"
		});

	dataGrab(neighbourhood_id, function(err, data){
		if (err){
			console.log(err);
		}
		else {
			jsonData = data;
			console.log(jsonData);
			res.status(200).send(jsonData);
		}
	});

});
