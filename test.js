$(document).ready(function() {
  if (scale_date == null) {
    scale_date = localStorage.getItem(scale_date);
  }
  for (i = 6; i > 1; i--) {
    // it's need to be assync
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
    });
  }
  $("#satellite")
    .on("click", function() {
      actived = localStorage.getItem(actived);
      imageBounds = [
        [
          satellite_src[scale_date].location[0][0],
          satellite_src[scale_date].location[0][1]
        ],
        [
          satellite_src[scale_date].location[1][0],
          satellite_src[scale_date].location[1][1]
        ]
      ];

      layer = L.imageOverlay(satellite_src[scale_date].src, imageBounds);
      alert(actived);
      if (actived == 0) {
        layer.addTo(map);
        localStorage.setItem(actived, 1);
      } else {
        layer.remove(map);
        localStorage.setItem(actived, 0);
      }
    })
    .change();
});
