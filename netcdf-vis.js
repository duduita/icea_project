const today = new Date(); // It's too repetitive
const year = today.getFullYear();
const month = ("0" + (today.getMonth() + 1)).slice(-2);
const day = ("0" + today.getDate()).slice(-2);
const hour = ("0" + today.getHours()).slice(-2); // Need double check
const formattedToday = `${year}${month}${day}${hour}`;

var scale_date;

var satellite_src;

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
    maxBoundsViscosity: 1,
    attributionControl: false
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
  //idw.addTo(map);
  //layerControl.addOverlay(idw, "Global Temp").addTo(map);

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

  $(document).ready(function() {
    var on = 0;
    //alert("ready");
    $("#australia")
      .on("click", function() {
        //alert("called");
        if (!on) {
          velocityLayer.addTo(map);
          on = 1;
        } else {
          velocityLayer.remove(map);
          on = 0;
        }
      })
      .change();
  });
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

  $(document).ready(function() {
    var on = 0;
    //alert("ready");
    $("#global")
      .on("click", function() {
        //alert("called");
        if (!on) {
          velocityLayer.addTo(map);
          on = 1;
        } else {
          velocityLayer.remove(map);
          on = 0;
        }
      })
      .change();
  });
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

  $(document).ready(function() {
    var on = 0;
    //alert("ready");
    $("#south")
      .on("click", function() {
        //alert("called");
        if (!on) {
          velocityLayer.addTo(map);
          on = 1;
        } else {
          velocityLayer.remove(map);
          on = 0;
        }
      })
      .change();
  });
});

$.getJSON("data/newmodel.json", function(data) {
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

  $(document).ready(function() {
    var on = 0;
    //alert("ready");
    $("#test")
      .on("click", function() {
        //alert("called");
        if (!on) {
          velocityLayer.addTo(map);
          on = 1;
        } else {
          velocityLayer.remove(map);
          on = 0;
        }
      })
      .change();
  });
});

$(document).ready(function() {
  //alert(formattedToday);
  $.ajax({
    url: `https://api-redemet.decea.mil.br/produtos/satelite/realcada?api_key=gdkP7S0gy9sB4JsOLoYe34D52CGyrDzZK3xAWe80&data=${formattedToday}`
  }).then(function(res) {
    imageBounds = [
      [res.data.lat_lon.lat_min, res.data.lat_lon.lon_min],
      [res.data.lat_lon.lat_max, res.data.lat_lon.lon_max]
    ];
    imageUrl = res.data.satelite[0].path;
    var layer = L.imageOverlay(imageUrl, imageBounds);
    var actived = 0;
    $("#satellite")
      .on("click", function() {
        if (!actived) {
          layer.addTo(map);
          actived = 1;
        } else {
          layer.remove(map);
          actived = 0;
        }
      })
      .change();
  });
});

$(document).ready(function() {
  //alert(formattedToday); // Need to check if this format is okay
  $.ajax({
    url: `https://api-redemet.decea.mil.br/produtos/radar/maxcappi?api_key=gdkP7S0gy9sB4JsOLoYe34D52CGyrDzZK3xAWe80&data=${formattedToday}`
  }).then(function(res) {
    var formattedJson = JSON.stringify(res, null, "\t");
    var myLayerGroup = L.layerGroup();
    for (i = 0; i < res.data.radar[0].length; i++) {
      imageBounds = [
        [res.data.radar[0][i].lat_min, res.data.radar[0][i].lon_min],
        [res.data.radar[0][i].lat_max, res.data.radar[0][i].lon_max]
      ];
      imageUrl = res.data.radar[0][i].path;
      if (imageUrl != undefined) {
        var layer = L.imageOverlay(imageUrl, imageBounds);
        myLayerGroup.addLayer(layer);
      }
    }
    var actived = 0;
    $("#radar")
      .on("click", function() {
        if (!actived) {
          myLayerGroup.addTo(map);
          actived = 1;
        } else {
          myLayerGroup.remove(map);
          actived = 0;
        }
      })
      .change();
  });
});

$("#date-1").click(function() {
  $("#p-bar").css({ width: "16.66%", transition: "1s" });
  scale_date = 1;
  alert(scale_date);
});
$("#date-2").click(function() {
  $("#p-bar").css({ width: "33.33%", transition: "1s" });
  scale_date = 2;
  alert(scale_date);
});
$("#date-3").click(function() {
  $("#p-bar").css({ width: "50%", transition: "1s" });
  scale_date = 3;
  alert(scale_date);
});
$("#date-4").click(function() {
  $("#p-bar").css({ width: "66.66%", transition: "1s" });
  scale_date = 4;
  alert(scale_date);
});
$("#date-5").click(function() {
  $("#p-bar").css({ width: "83.3%", transition: "1s" });
  scale_date = 5;
  alert(scale_date);
});
$("#date-6").click(function() {
  $("#p-bar").css({ width: "100%", transition: "1s" });
  scale_date = 6;
  alert(scale_date);
});

$(document).ready(function() {
  //alert(formattedToday);
  for (i = 6; i > 1; i--) {
    $.ajax({
      url: `https://api-redemet.decea.mil.br/produtos/satelite/realcada?api_key=gdkP7S0gy9sB4JsOLoYe34D52CGyrDzZK3xAWe80&data=20210209${16 -
        i}`
    }).then(function(res) {
      imageBounds = [
        [res.data.lat_lon.lat_min, res.data.lat_lon.lon_min],
        [res.data.lat_lon.lat_max, res.data.lat_lon.lon_max]
      ];
      imageUrl = res.data.satelite[0].path;
      satellite_src.push({ location: imageBounds, src: imageUrl });
      console.log(satellite_src[0]);
    });
  }
  var actived = 0;
  $("#satellite")
    .on("click", function() {
      if (!actived) {
        layer.addTo(map);
        actived = 1;
      } else {
        layer.remove(map);
        actived = 0;
      }
    })
    .change();
});
