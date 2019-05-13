
// Creating a mapbox layer and adding it to the canvas map.

//creating a marker:
L.marker([51.5, -0.09]).addTo(mymap).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

//creating a polygon:
L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap).bindPopup("I am a polygon.");

//Adds a circle 
L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(mymap).bindPopup("I am a circle.");

// display the file text on the web page
function displayContents(contents) {
    var element = document.getElementById('file-content');
    element.innerHTML = contents;
  }

    // Inserting an EasyButton:
var helloPopup = L.popup().setContent('Hello World!');
L.easyButton('fa-file-code-o', function(btn, map){
    //helloPopup.setLatLng(map.getCenter()).openOn(map);
    readSingleFile();
  }).addTo(mymap);


  // markers
var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
var cities = L.layerGroup([littleton, denver, aurora, golden]);
