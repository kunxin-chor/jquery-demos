// global variable
let map;
let endpoint = "https://earthquake.usgs.gov/fdsnws/event/1/query";

function init() {
    // vanila JavaScript:
    // map = new google.maps.Map(document.getElementById("map"));

    // Using jQuery
    let div_map = $("#map")[0];
    map = new google.maps.Map(div_map, {
        'center': { lat: 0.7893, lng: 113.9213 },
        'zoom': 6
    });

}

function getEarthquakeDataAsync(consumer) {
    let parameters = {
        'format': 'geojson',
        'starttime': '2014-01',
        'endtime': '2014-02',
        'longitude': 113.9213,
        'latitude': 0.7893,
        'maxradiuskm': 2000
    }

    axios.get(endpoint, {
        'params': parameters
    }).then((response) => {
        console.log(response.data);
        consumer(response.data.features)
    })

    /* axios.get(endpoint, params: {
     parameters).then(function(response){
        
     }) */
}

function consumeEarthquakeData(earthquakes) {
    // for (let i = 0; i < earthquakes.length; i++) {
    //     let each_earthquake = earthquakes[i];

    //     if (each_earthquake.properties.mag > 5 && 
    //         each_earthquake.properties.status == 'reviewed') {
    //         let marker = new google.maps.Marker({
    //             'position': { lat: each_earthquake.geometry.coordinates[1], lng: each_earthquake.geometry.coordinates[0] },
    //             'map': map,
    //             'title': each_earthquake.properties.title
    //         })
    //     }

    // }
    
    earthquakes = earthquakes.map(function(item){
        return {
            'lat' : item.geometry.coordinates[1],
            'lng' : item.geometry.coordinates[0],
            'mag' : item.properties.mag,
            'title': item.properties.title
        }
    })
    
    earthquakes = earthquakes.filter(function(item){
        return item.mag >= 5;
    })
    
    earthquakes.forEach(showEarthquakes);
    
    console.log(earthquakes);
    // earthquakes.forEach(showEarthquakes);
}

let showEarthquakes = (each_earthquake, index) => {
    let marker = new google.maps.Marker({
        'position': { lat: each_earthquake.lat, lng: each_earthquake.lng },
        'map': map,
        'title': each_earthquake.title
    })
}

$(function() {
    getEarthquakeDataAsync(consumeEarthquakeData);
})
