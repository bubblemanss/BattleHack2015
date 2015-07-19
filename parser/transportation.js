    module.exports= function (data){
        return {
            name: "Transportation",
            neighbourhood: returnColumn(data, 0),
            neighbourhood_id: returnColumn(data, 1),
            ttc_stops: returnColumn(data, 2),
            other_collision: returnColumn(data, 4),
            traffic_collision: returnColumn(data, 5)
        }
    }

    function returnColumn (data, index) {
        var col3 = data.map(function(value){
            return value[index];
        });
        return col3;
    }