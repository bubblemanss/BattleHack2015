var array = [];  
var objArray = [];
var parser = require('./parseHandler');
var safety, economic, transportation;
var neighbourhoodID=1;

module.exports = function(id, callback){
	parser(function(err, data){
		if (err){
			console.log(err);
		}
		else {
			//populate variable array with the parsed data from given back from parse.js
			neighbourhoodID = id;
			safety = data[0];
			economic = data[1];
			transportation = data[2];
			setReturn();
			callback(err,returnValue);
		}
		
	});
}

function setReturn(){
	returnValue.neighbourhood = safety.neighbourhood[neighbourhoodID];
	returnValue.neighbourhood_id= safety.neighbourhood_id[neighbourhoodID];
	returnValue.arsons= safety.arsons[neighbourhoodID];
    returnValue.assaults= safety.assaults[neighbourhoodID],
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







