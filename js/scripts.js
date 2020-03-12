// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoiZG9zemhhbmFsaWJla292IiwiYSI6ImNrNmt1eXV2ZTAxbTYzbG9iYjd2dzNua3kifQ.n1p-Bmu2_4eDqkwZlPceAA';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-74.018669, 40.687147]
var initialZoom = 11

// set the default text for the feature-info div

var defaultText = '<p>What can you do here: include all the functions</p>'
$('#feature-info').html(defaultText)
// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/light-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);

// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// wait for the initial style to Load
map.on('style.load', function() {

  // add a geojson source to the map using our external geojson file
  map.addSource('pluto-waterfront-nyc', {
    type: 'geojson',
    data: './data/Waterfront.geojson',
  });

  // add a layer for our custom source
   map.addLayer({
     id: 'fill-pluto-waterfront-nyc',
     type: 'fill',
     source: 'pluto-waterfront-nyc',
     paint: {
      'fill-color': '#6baed6'
     }
   })

  // let's make sure the source got added by logging the current map state to the console
  console.log(map.getStyle().sources)

  // add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {type: 'FeatureCollection',properties: []
    }
  })

  // add a layer for the highlighted lot
  map.addLayer({
    id: 'highlight-line',
    type: 'line',
    source: 'highlight-feature',
    paint: {
      'line-width': 2,
      'line-opacity': 0.9,
      'line-color': 'white',
    }
  });

  // listen for the mouse moving over the map and react when the cursor is over our data
  map.on('mousemove', function (e) {

    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['fill-pluto-waterfront-nyc'],
    });

    // if the mouse pointer is over a feature on our layer of interest
    // take the data for that feature and display it in the sidebar
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

      var hoveredFeature = features[0]
      var featureInfo = `
        <p><strong>Name:</strong> ${hoveredFeature.properties.name}</p>
        <p><strong>Agency:</strong> ${hoveredFeature.properties.agency}</p>
        `
      $('#feature-info').html(featureInfo)

      // set this lot's polygon feature as the data for the highlight source
      map.getSource('highlight-feature').setData(hoveredFeature.properties.name);
    } else {

      // if there is no feature under the mouse, reset things:
      map.getCanvas().style.cursor = 'default'; // make the cursor default

      // reset the highlight source to an empty featurecollection
      map.getSource('highlight-feature').setData({
        type: 'FeatureCollection',
        features: []
      });

      // reset the default message
      $('#feature-info').html(defaultText)
    }
  })
})

// create a HTML element for each feature
var el = document.createElement('div');
el.className = 'marker';

// make a marker and add to the map
  new mapboxgl.Marker(el)
    .setLngLat([-74.003933, 40.707177])
    .addTo(map);

    new mapboxgl.Marker(el)
      .setLngLat([-74.003933, 40.707177])
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
       .setHTML(`${name}<strong><p>Waterfront Alliance</strong><p><a href="https://waterfrontalliance.org/www/" target="_blank">Waterfront Alliance</a> inspires and effects resilient, revitalized, and accessible coastlines for all communities`))
      .addTo(map);
      //

// add a geocoder to my map, let people find what they look for
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl // Set the mapbox-gl instance
    });

    // Add the geocoder to the map

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


var filterGroup = document.getElementById('filter-group');
//var map = new mapboxgl.Map({
  //container: 'map',
  //style: 'mapbox://styles/mapbox/light-v10',
  //center: [-77.04, 38.907],
  //zoom: 11.15
//});

// Add a GeoJSON source containing place coordinates and information.
map.addSource('places', {
  'type': 'geojson',
  'data': {type: 'FeatureCollection',properties: []
}

places.features.forEach(function(feature {
  var symbol = feature.properties['icon'];
  var layerID = 'poi-' + symbol;
}
// Add a layer for this symbol type if it hasn't been added already.
  if (!map.getLayer(layerID)) {
    map.addLayer({
      id: layerID,
      type: 'symbol',
      source: 'places',
      layout: {
        'icon-image': symbol + '-15',
        'icon-allow-overlap': true
      },
      'filter': ['==', 'icon', symbol]
  });

// Add checkbox and label elements for the layer.
var input = document.createElement('input');
  input.type = 'checkbox';
    input.id = layerID;
      input.checked = true;
        filterGroup.appendChild(input);

var label = document.createElement('label');
  label.setAttribute('for', layerID);
      label.textContent = symbol;
          filterGroup.appendChild(label);

// When the checkbox changes, update the visibility of the layer.
      input.addEventListener('change', function(e) {
        map.setLayoutProperty(
          layerID,
            'visibility',
            e.target.checked ? 'visible' : 'none'
          );
        });
      }
    });
  });
