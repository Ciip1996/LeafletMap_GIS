// create arrays where polygons and polylines will be stored temporally:
var polylineArray = [];
var polygoneArray = [];

// create 1 polyline: this should be replaced by the user creating its own polyforms

var latlngs = [
  [45.51, -122.68],
  [37.77, -122.43],
  [34.04, -118.2]
];

var polyline = L.polyline(latlngs, {color: 'red'});
polylineArray.push(polyline);

// create 1 polygon 
var latlngs = [
  [45, -122.05],
  [41, -122.03],
  [41, -122.05],
  [37, -121.04]
];
var polygon = L.polygon(latlngs, {color: 'blue'});
polygoneArray.push(polygon);

// zoom the map to the polyline
mymap.fitBounds(polyline.getBounds());

// Create layers of polylines and polygons:
var layerPolyline = L.layerGroup(polylineArray);
layerPolyline.addTo(mymap);

var layerPolygon = L.layerGroup(polygoneArray);
layerPolygon.addTo(mymap);

// Filter control:
var baseLayers = {
  "Points": layerPolyline, // replaces THIS
  "Lines": layerPolygon,   // replaces THIS
  "Polylines": layerPolyline,
  "Polygon": layerPolygon
};
var filters = {
  "Points": layerPolyline, // replaces THIS
  "Lines": layerPolygon,   // replaces THIS
  "Polylines": layerPolyline,
  "Polygon": layerPolygon
};
// Add a layer control element to the map
layerControl = L.control.layers(baseLayers, null, {position: 'topright', collapsed: false});
layerControl.addTo(mymap);

filterLayersControl = L.control.layers(null, filters, {position: 'topright', collapsed: true});
filterLayersControl.addTo(mymap);


/*
-  Functions: 
*/
var popup = L.popup();

/** The following method will be called once touching the map. */
mymap.on('click', function (e){
  console.log("latlng: " + e.latlng);
  //debugger;
  //alert(L.control);
  popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
});

/** The following method will be called once the layers filter is changed. */
mymap.on('baselayerchange', function (e){
  switch(e.name){
    case "Points":
      break;
    case "Lines":
      break;
    case "Polylines":
      break;
    case "Polygons":
      break;
    default:
      break;
  }
  //alert("Name: " + e.name + " Layer: " + e.layer);
});