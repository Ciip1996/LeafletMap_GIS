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
    polyline: false,
    circle: false, // Turns off this drawing tool
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

map.on('draw:created', function (e) {
  var type = e.layerType,
    layer = e.layer;
  layer.options.color = document.getElementById("color").value.toString();

  if (type === 'polyline') {
    layer.bindPopup('A polyline!');
    editableLayersPolyline.addLayer(layer);
  }
  else if (type === 'polygon') {
    layer.bindPopup('A polygon!');
    editableLayersPolygon.addLayer(layer);
  }
  else if (type === 'circle') {
    layer.bindPopup('A point!');
    editableLayersPoint.addLayer(layer);
  }
  //editableLayersPolygon.addLayer(layer);
});

var filters = {};
var layerControl = false;

// Add a layer control element to the map
var textFile = "";
var polygon = {
  "guid": null,
  "coordinates": [],
  "ciudad": ""
}
var arrayPolygon = [];
var tempArray = [];
var layersArray = [];
var countLayers = 0;

var popup = L.popup();

// Functions:
function textFileToObject() {
  try {
    //tempArray = arrayPolygon; //save the current poligons
    arrayPolygon = [];//clear the array

    var currentPolygoneCoordinates = [];
    var polygonsArray = textFile.split('\n');
    var i = 1;
    polygonsArray.forEach(element => {
      //Parsing the weird fucking type 
     
      var GUID_elements = element.split(')))",');
      if (element != ""){
        var Coordinates = GUID_elements[0].split('MULTIPOLYGON (((');;
        var otherElements = GUID_elements[1].split(',');

        var e2 = otherElements[1];
        var ciudad = otherElements[4];

        var stringCoordinates = Coordinates[1].split(',');//string with both x and y
        stringCoordinates.forEach(coordinate => {
          var coordinate = coordinate.split(' ');
          var X = ((parseFloat(coordinate[0]) / 10000)) * .1;// - 103.9;
          var Y = ((parseFloat(coordinate[1]) / 100000)) * .9;// + 0.07); //al tanteo
          currentPolygoneCoordinates.push([Y,X]);      
        });

        polygon.coordinates = currentPolygoneCoordinates;
        polygon.guid = e2;
        polygon.ciudad = ciudad;
        arrayPolygon.push(polygon);
        currentPolygoneCoordinates = [];
        polygon = {};
        i++;
      }
    });
    layersArray.push(arrayPolygon);//saving the layers for later.
    //arrayPolygon = arrayPolygon.concat(tempArray); 
    //limpiar();

    //creating the new feature group which is going to be the layer group for filters:
    var newLayer = new L.FeatureGroup();
    map.addLayer(newLayer);

    /*newLayer.on('click', function(e) {
      objectOut = newLayer.toGeoJSON();
      textOut = JSON.stringify(objectOut);
      alert(textOut);
      var highlight = {
        'color': '#fff',
        'weight': 2,
        'opacity': 1
      };    
      newLayer.setStyle(highlight);
    });*/
    
    var _color = document.getElementById("color").value.toString();
    
    arrayPolygon.forEach(element => {
      var _polygone = L.polygon(element.coordinates, { color: _color }).addTo(map).bindPopup("Ciudad: " + element.ciudad + " Id:" + element.guid);
      _polygone.on('click', function(e) {
        //objectOut = newLayer.toGeoJSON();
        //textOut = JSON.stringify(objectOut);
        //alert(textOut);
        var highlight = {
          'color': 'blue',
          'weight': 3,
          'opacity': 1
        };    
        _polygone.setStyle(highlight);
      });
  
      newLayer.addLayer(_polygone);
    });

    //add the control layer to the map and update it too:
    if(layerControl === false) {
      layerControl = L.control.layers().addTo(map);
    }
    layerControl.addOverlay(newLayer, "Layer" + countLayers);
    countLayers++;
    // zoom the map to the polyline
    map.fitBounds(newLayer.getBounds());
  }
  catch (error) {
    alert("The file you are trying to open might be corrupted. \n Error Message: " + error.message);
  }
}
function limpiar() {
  for (i in map._layers) {
    if (map._layers[i]._path != undefined) {
      try {
        map.removeLayer(map._layers[i]);
      }
      catch (e) {
        console.log("problem with " + e + map._layers[i]);
      }
    }
  }
}

function saveCoordinatesFile() {
  var coords = []; //define an array to store coordinates
  //if I ever need the geoJSON info:

  var geoJSONObject_Polygon = editableLayersPolygon.toGeoJSON();
  var array = [geoJSONObject_Polygon];

  array.forEach(function (each) {
    L.geoJson(each, {
      onEachFeature: function (feature, layer) {
        popupOptions = { maxWidth: 200 };
        layer.bindPopup(feature.properties.popupContent);
        coords.push(feature.geometry.coordinates);
      } //end onEachFeature
    });
  });
  console.log(coords);
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
        var line = "id;" + "Segment " + i + ";" + j + ";" + x + ";" + y + '\n';
        strText += line;
        j++;
      });
    });
    i++;
  });
  console.log(strText);
}

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    textFile = e.target.result;
    textFileToObject();
  };
  reader.readAsText(file);
}
document.getElementById('btnFile').addEventListener('change', readSingleFile, false);


function showPanel() {
  var displayStatus = document.getElementById('sidebar').style.display;
  if (displayStatus === "none" || displayStatus === "") {
    document.getElementById('sidebar').style.display = "inline-block";
  }
  else {
    document.getElementById('sidebar').style.display = "none";
  }
}

