function initDemoMap() {
  var Esri_DarkGreyCanvas = L.esri.basemapLayer("DarkGray");
  var Esri_WorldImagery = L.esri.basemapLayer("Imagery");
  //prettier-ignore
  var baseLayers = {
    "Grey Canvas": Esri_DarkGreyCanvas,
    "Satellite": Esri_WorldImagery
  };

  // set map bounds
  var corner1 = L.latLng(-89.98155760646617, -180.0),
    corner2 = L.latLng(89.99346179538875, 180.0),
    bounds = L.latLngBounds(corner1, corner2);

  var map = L.map("map", {
    layers: [Esri_DarkGreyCanvas],
    center: bounds.getCenter(),
    zoom: 10,
    minZoom: 2,
    maxZoom: 5,
    maxBounds: bounds,
    maxBoundsViscosity: 1
  });

  // layer control panal
  var layerControl = L.control.layers(baseLayers, null, { collapsed: false });
  layerControl.addTo(map);
  map.setView([-18, -50], 5);

  // idw-map
  var idw = L.idwLayer(addressPoints, {
    opacity: 0.3,
    maxZoom: 18,
    cellSize: 5,
    exp: 3,
    max: 75
  });
  idw.addTo(map);
  layerControl.addOverlay(idw, "Global Temp").addTo(map);

  return {
    map: map,
    layerControl: layerControl
  };
}

// leaflet-velocity layer
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

// load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
$.getJSON("data/australia.json", function(data) {
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Wind",
      displayPosition: "bottomleft",
      displayEmptyString: "No wind data"
    },
    data: data,
    maxVelocity: 25
  });

  layerControl.addOverlay(velocityLayer, "Australia Wind");
});

$.getJSON("data/global.json", function(data) {
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Wind",
      displayPosition: "bottomleft",
      displayEmptyString: "No wind data"
    },
    data: data,
    maxVelocity: 25
  });

  layerControl.addOverlay(velocityLayer, "Global Wind");
});

$.getJSON("data/problem.json", function(data) {
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Wind",
      displayPosition: "bottomleft",
      displayEmptyString: "No wind data"
    },
    data: data,
    maxVelocity: 25
  });

  layerControl.addOverlay(velocityLayer, "South America Wind");
  map.setView([-18, -50], 5);
});

$.getJSON("data/sampling.json", function(data) {
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Wind",
      displayPosition: "bottomleft",
      displayEmptyString: "No wind data"
    },
    data: data,
    maxVelocity: 25
  });

  layerControl.addOverlay(velocityLayer, "Sampling America Wind");
  map.setView([-18, -50], 5);
});
