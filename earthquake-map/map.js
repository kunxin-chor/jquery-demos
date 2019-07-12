// global variable
let map;
let endpoint = "https://earthquake.usgs.gov/fdsnws/event/1/query";
let params = {
    'lat':0.7893,
    'lng': 113.9213,
    'radius' : 2000
}
let markers = [];
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

function getEarthquakeDataAsync(consumer, config) {
    
    let parameters = {
        'format': 'geojson',
        'starttime': '2014-01',
        'endtime': '2014-02',
        'longitude': config.lng,
        'latitude': config.lat,
        'maxradiuskm':config.radius
    }
    
    axios.get(endpoint, {
        'params': parameters
    }).then((response) => {
        $('#display-error').hide();
        console.log(response.data);
        consumer(response.data.features)
    }).catch(function(error){
       $("#display-error").show();
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
    
    // remove all earthqaukes with magnitude less than 5
    earthquakes = earthquakes.filter(function(item){
        return item.mag >= 5;
    })
    
    console.log("---- Before removing markers");
     console.log(markers);
   
    // remove all markers
     markers.forEach(function(marker){
        marker.setMap(null)
    });
    
    // Set markers array to be empty
    markers = [];
    console.log("After removing markers -->")
    // show marker for each earthquake
    earthquakes.forEach(showEarthquakes);
    
     console.log(markers);
    
    console.log(earthquakes);
    // earthquakes.forEach(showEarthquakes);
    console.log(params.lat)
    map.setCenter({
        lat:parseFloat(params.lat),
        lng:parseFloat(params.lng)
    })
}

let showEarthquakes = (each_earthquake, index) => {
  
   
    let marker = new google.maps.Marker({
        'position': { lat: each_earthquake.lat, lng: each_earthquake.lng },
        'map': map,
        'title': each_earthquake.title
    })
    

    markers.push(marker);
}

$(function() {
    
    $('#display-error').hide();
    
    getEarthquakeDataAsync(consumeEarthquakeData, params);

    $('#update-btn').click(function(){
       params.lat = $("#lat").val();
       params.lng = $('#lng').val();
       params.radius = $("#radius").val();
       params.mag = $("#mag").val();
       getEarthquakeDataAsync(consumeEarthquakeData, params);
    })
    
});
