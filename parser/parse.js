    var fs = require('fs');
    var parse = require('csv-parse');
    var strData =['WB-Safety.csv','WB-Economics.csv','WB-Transportation.csv'];
    var array = [];    
    //Function to read in CSV file
    module.exports = function(callback){
    	for (i = 0 ; i < strData.length ; i++){
	        var parser = parse(function(err, data){
				if (err){
					console.log(err);
				}
				else {
					//pushes different csv file data onto array and then sends it all back
					array.push(data);
					//wait until all csv files have been processed
					if (array.length == strData.length) {
						callback(err, array);
					}
				}		
			});
			// THIS LINE READS IN THE CSV FILE AND LINKS IT TO THE PARSER
	        fs.createReadStream(__dirname+'/files/'+ strData[i]).pipe(parser); 

		 }
    }