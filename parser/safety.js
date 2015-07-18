    module.exports= function (data){
        return {
            name: "Safety",
            neighbourhood: returnColumn(data, 0),
            neighbourhood_id: returnColumn(data, 1),
            arsons: returnColumn(data, 2),
            assaults: returnColumn(data, 3),
            break_enter: returnColumn(data, 4),
            drug_arrest: returnColumn(data, 5), 
            hazardous_incidents: returnColumn(data, 9),
            murders: returnColumn(data, 10), 
            robberies: returnColumn(data, 11),
            sexual_assaults: returnColumn(data, 12), 
            thefts: returnColumn(data, 13),
            vechile_thefts: returnColumn(data, 15), 
            total_crime: returnColumn(data, 14) 
        }
    }


    function returnColumn (data, index) {
        var col3 = data.map(function(value){
            return value[index];
        });
        return col3;
    }