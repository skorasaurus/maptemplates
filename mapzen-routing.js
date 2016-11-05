var map = L.map('map');


// pulled from and modified from https://github.com/mapzen/lrm-mapzen

if (hasWebGL()) {
  // use Tangram to draw tiles when there is WebGL available on the browser
  var layer = Tangram.leafletLayer({
    scene: 'https://cdn.rawgit.com/tangrams/refill-style/gh-pages/refill-style.yaml',
    attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
  });
  layer.addTo(map);
} else {
  // Use normal OSM tiles instead of Tangram when there is no webgl available
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);
}


// detect webgl on browser for Tangram
function hasWebGL() {
  try {
    var canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (x) {
    return false;
  }
}

var control = L.Routing.control({
  waypoints: [
    L.latLng(41.49417, -81.68317),
    L.latLng(41.49417, -81.68417) // chokes if you use the same two waypoints)
  ],
  // You can get your own Mapzen turn-by-turn & search API key from the Mapzen developer portal (https://mapzen.com/developers/)
  geocoder: L.Control.Geocoder.mapzen('search-RH8pVLv', {
  params: {
         sources: 'oa',
         'boundary.country': 'USA',
         focus: [41.49417, -81.68317],
    //     'focus.point.lat': 41.49417, 
      //   'focus.point.lon': -81.68317
  }}
  ), 

  reverseWaypoints: true,
  router: L.Routing.mapzen('valhalla-PVA4Y8g', {costing: 'auto'}),
  formatter: new L.Routing.mapzenFormatter({units: 'imperial'}),
  summaryTemplate:'<div class="start">{name}</div><div class="info {costing}">{distance}, {time}</div>'
}).addTo(map);

L.Routing.errorControl(control).addTo(map);