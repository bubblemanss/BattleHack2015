var array = [];  
var objArray = [];
var reader = require('./parse');
var safety_parse = require('./safety');
var economic_parse = require("./economics");
var transportation_parse = require("./transportation");

module.exports = function(callback){
	reader(function(err, data){
		if (err){
			console.log(err);
		}
		else {
			//populate variable array with the parsed data from given back from parse.js
			array = data;
		}
		//Structure and set differnt data tables into different variables
		setSafety(array[0]);
		setEconomics(array[1]);
		setTranportation(array[2]);
		//Wait for all information to be loaded
		while (true){
			if (objArray.length == 3) {
				callback(err, objArray);
				break;
			}
		}
	});
}

//Format csv files and pushes onto the response array
function setSafety(data){
	objArray.push(safety_parse(data));
	///console.log(safety_parse(data));
}
function setEconomics(data){
	objArray.push(economic_parse(data));
	//console.log(economic_parse(data).local_employment);
}
function setTranportation(data){
	objArray.push(transportation_parse(data));
	//console.log(transportation_parse(data).other_collision);
}