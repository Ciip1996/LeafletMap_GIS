// The Leaflet Developers https://github.com/Leaflet/Leaflet

/*
-  Map: 
*/

// center of the map
var center = [20.779227, -100.432935];

// Create the map
var map = L.map('mapid', {
  center: center,
  zoom: 10
});

/*
-  Global Variables: 
*/

// Initialise the FeatureGroup to store editable layers

var editableLayersPolygon = new L.FeatureGroup();
map.addLayer(editableLayersPolygon);

var editableLayersPolyline = new L.FeatureGroup();
map.addLayer(editableLayersPolyline);

var editableLayersPoint = new L.FeatureGroup();
map.addLayer(editableLayersPoint);

var options = {
  position: 'bottomleft',
  draw: {
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    polyline: {
    	shapeOptions: {
        color: '#f357a1',
        weight: 10
          }
    },
    // disable toolbar item by setting it to false
    polyline: true,
    circle: true, // Turns off this drawing tool
    polygon: true,
    marker: false,
    rectangle: false,
  }/*,
  edit: {
    featureGroup: editableLayersPolygon, 
    remove: false
  }*/
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;
    layer.options.color = document.getElementById("color").value.toString();

  if (type === 'polyline') {
    layer.bindPopup('A polyline!');
    editableLayersPolyline.addLayer(layer);
  } 
  else if ( type === 'polygon') {
    layer.bindPopup('A polygon!');
    editableLayersPolygon.addLayer(layer);
  } 
  else if (type === 'circle') 
  {
    layer.bindPopup('A point!');
    editableLayersPoint.addLayer(layer);
  }
  //editableLayersPolygon.addLayer(layer);
});

var filters = {
  "Polylines": editableLayersPolyline,
  "Polygon": editableLayersPolygon,
  "Point": editableLayersPoint
};
// Add a layer control element to the map
filterLayersControl = L.control.layers(null, filters, {position: 'topright', collapsed: true});
filterLayersControl.addTo(map);


var guid_Coordinates = "";
var polygon = {
  "guid": null,
  "coordinates": []
}
var arrayPolygon = [];



var popup = L.popup();

// Functions:
function textFileToObject()
{
  try 
  {
    var currentPolygoneCoordinates = [];
    var guidRowsArray = guid_Coordinates.split('\n');
    var i = 1;

    guidRowsArray.forEach(element => {
      //GUID;SEGMENTNAME;NODENUMBER;X;Y
    
      var GUID_elements = element.split(';');
      var node = GUID_elements[2];
      var X = ((parseFloat(GUID_elements[3]) / 10000)) * .1;// - 103.9;
      var Y = ((parseFloat(GUID_elements[4]) / 100000)) * .9;// + 0.07); //al tanteo
      currentPolygoneCoordinates.push([Y,X]);  
      

      //validations:
      if(i < guidRowsArray.length)
      {
        //console.log(i);
        var txtNextGuidRow = guidRowsArray[i].split(';');
        var nextNode = txtNextGuidRow[2];
        if (nextNode == 1)
        {
          polygon.coordinates = currentPolygoneCoordinates;
          polygon.guid = GUID_elements[0];
          arrayPolygon.push(polygon);
          currentPolygoneCoordinates = [];
          polygon={};
        }
      }
      else{
        polygon.coordinates = currentPolygoneCoordinates;
        polygon.guid = GUID_elements[0];
        arrayPolygon.push(polygon);
        currentPolygoneCoordinates = [];
        polygon={};
      }
      i++;
    });

  //  var group = [];
  var _color = document.getElementById("color").value.toString();
    if (arrayPolygon.length == 0)
    {  
      var _polygone = L.polygon(currentPolygoneCoordinates, {color: _color}).addTo(map).bindPopup("I am a polygon.");
      editableLayersPolygon.addLayer(_polygone);
      //group.push(_polygone);
    }
    else {  
      arrayPolygon.forEach(element => {
        var _polygone = L.polygon(element.coordinates, {color: _color}).addTo(map).bindPopup("I am the polygon with id: " + element.guid);
        //group.push(_polygone);
        editableLayersPolygon.addLayer(_polygone);
      });
    }    
    // zoom the map to the polyline
    //var gp = new L.featureGroup(group);
    map.fitBounds(editableLayersPolygon.getBounds());
  } 
  catch (error) {
    alert("The file you are trying to open might be corrupted. \n Error Message: " + error.message);
  }
}
function limpiar(){
  for(i in map._layers) {
    if(map._layers[i]._path != undefined) {
        try {
          map.removeLayer(map._layers[i]);
        }
        catch(e) {
            console.log("problem with " + e + map._layers[i]);
        }
    }
}
}

function saveCoordinatesFile(){
  var coords = []; //define an array to store coordinates
  //if I ever need the geoJSON info:
  
  var geoJSONObject_Polygon = editableLayersPolygon.toGeoJSON();
  //var geoJSONObject_Polyline = editableLayersPolyline.toGeoJSON();
  //var geoJSONObject_Point = editableLayersPoint.toGeoJSON();
  var array = [geoJSONObject_Polygon ];
  
  array.forEach(function(each) {
    L.geoJson(each, {
      onEachFeature: function (feature, layer) {
        popupOptions = {maxWidth: 200};
        layer.bindPopup(feature.properties.popupContent);
        coords.push(feature.geometry.coordinates);
      } //end onEachFeature
    });  
  });  
  console.log(coords);
  // create GUID file type
    //var fso = CreateObject("Scripting.FileSystemObject");  
    //var s = fso.CreateTextFile("C:\test.txt", True);
    var strText = '';
    var i = 1;
    coords.forEach(form => //cada figura a iterar : 1
      {
        var j = 1;
        form.forEach(element => //element sera un arreglo que contiene todos los renglones
          {
            element.forEach(coordinate => //element sera un arreglo que contiene todos los renglones
              {            
                var x = Math.abs(parseFloat(coordinate[0])) / 0.1;
                var y = Math.abs(parseFloat(coordinate[1])) / 0.9;
                x = x * 10000;
                y = y * 100000;
                var line = "id;" + "Segment " + i + ";" + j + ";" + x +";"+ y + '\n';
                strText += line;
                //s.writeline(line);
                j++;
              });
          });
          i++;
      });
      console.log(strText);
      //save the file now:
      document.getElementById('download').href = "data:text/plain;charset=UTF-8,"  + encodeURIComponent(strText);
    //s.Close();
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
  document.getElementById('download').addEventListener('click', saveCoordinatesFile, false);


  function showPanel(){
    var displayStatus = document.getElementById('sidebar').style.display;
    if(displayStatus === "none" || displayStatus === ""){
      document.getElementById('sidebar').style.display = "inline-block";
    }
    else{
      document.getElementById('sidebar').style.display = "none";
    }
  }
//map.on('click', onMapClick);