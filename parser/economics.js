    module.exports= function (data){
        return {
            name: "Economics",
            neighbourhood: returnColumn(data, 0),
            neighbourhood_id: returnColumn(data, 1),
            businesses: returnColumn(data, 2),
            child_care_space: returnColumn(data, 3),
            home_prices: returnColumn(data, 5),
            local_employment: returnColumn(data, 6)
        }
    }

    function returnColumn (data, index) {
        var col3 = data.map(function(value){
            return value[index];
        });
        return col3;
    }