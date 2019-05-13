// The Leaflet Developers https://github.com/Leaflet/Leaflet
var globalZoom = 8;
var mymap = L.map('mapid').setView([20.779227, -100.432935], globalZoom);
/*
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);*/
var guid_Coordinates = "";
var polygon = {
  "guid": null,
  "coordinates": []
}
var arrayPolygon = [];



var popup = L.popup();

function onMapClick(e) {
    console.log("latlng: " + e.latlng);
    popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
}

// Functions:
function textFileToObject()
{
  var currentPolygoneCoordinates = [];
  var guidRowsArray = guid_Coordinates.split('\n');
  var i = 1;

  guidRowsArray.forEach(element => {
    //GUID;SEGMENTNAME;NODENUMBER;X;Y
    var GUID_elements = element.split(';');
    var node = GUID_elements[2];
    var X = ((parseFloat(GUID_elements[3]) / 10000) * .1) - 103.9;
    var Y = ((parseFloat(GUID_elements[4]) / 100000) * .9 + 0.07); //al tanteo
    currentPolygoneCoordinates.push([Y,X]);

    //validations:
    if(i < guidRowsArray.length-1)
    {
      if (guidRowsArray[i].split(';')[2] == 1)
      {
        polygon.coordinates = currentPolygoneCoordinates;
        polygon.guid = GUID_elements[0];
        arrayPolygon.push(polygon);
        currentPolygoneCoordinates = [];
        polygon={};
      }
    }
    i++;
  });

  var group = [];

  if (arrayPolygon.length == 0)
  {  
    var _polygone = L.polygon(currentPolygoneCoordinates, {color: 'red'}).addTo(mymap).bindPopup("I am a polygon.");
    group.push(_polygone);
  }
  else {  
    arrayPolygon.forEach(element => {
      var _polygone = L.polygon(element.coordinates, {color: 'red'}).addTo(mymap).bindPopup(element.guid);
      group.push(_polygone);
    });
  }    
  // zoom the map to the polyline
  var gp = new L.featureGroup(group);
  mymap.fitBounds(gp.getBounds());

}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      guid_Coordinates = e.target.result;
      textFileToObject();
    };
    reader.readAsText(file);
  }
  document.getElementById('btnFile').addEventListener('change', readSingleFile, false);


mymap.on('click', onMapClick);