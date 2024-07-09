import {
  getShelter,
  updateShelter,
  postShelter,
  deleteShelter,
  initializeSocket,
  getIncidents,
} from './endpoints.js';

import { getThisShelterRatings, createAblum } from './endpoints.js';

let currentMarker = null;
let cur_lat_g = 0;
let cur_lng_g = 0;
let dest_lat_g = 0;
let dest_lng_g = 0;
let shelter_g = '';
let coordinates = [];
let sheltername = '';
let all_markers = [];

document.addEventListener('DOMContentLoaded', async function () {
  // establish socket connection
  const socket = await initializeSocket();

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        console.log('Latitude is :', position.coords.latitude);
        console.log('Longitude is :', position.coords.longitude);
        cur_lat_g = position.coords.latitude;
        cur_lng_g = position.coords.longitude;
        document.getElementById('loading').classList.add('hidden');
        await initializeMap(
          position.coords.latitude,
          position.coords.longitude,
          socket,
        );
      },
      async function (error) {
        console.error('Error Code = ' + error.code + ' - ' + error.message);
        document.getElementById('loading').classList.add('hidden');
        await initializeMap(-74.5, 40, socket);
      },
    );
  } else {
    console.log('Geolocation is not supported by this browser.');
    document.getElementById('loading').classList.add('hidden');
    await initializeMap(-74.5, 40, socket);
  }

  const goback = document.getElementById('back');

  goback.addEventListener('click', function () {
    back();
  });

  const close = document.getElementById('cancel');

  close.addEventListener('click', function () {
    cancel();
  });

  const submit = document.getElementById('register');

  submit.addEventListener('click', function () {
    register();
  });

  const add = document.getElementById('increaseCapacity');

  add.addEventListener('click', function () {
    update('increase');
  });

  const sub = document.getElementById('decreaseCapacity');

  sub.addEventListener('click', function () {
    update('decrease');
  });
});

// map feature
async function initializeMap(lat, lng, socket) {
  let zoomlevel = 1;
  let start = [-74.5, 40];
  if (localStorage.getItem('access') === null) {
    localStorage.setItem('access', 'true');
  } else {
    zoomlevel = 11;
    start = [-122.036349, 37.36883];
  }

  mapboxgl.accessToken =
    'pk.eyJ1IjoiZG9tb25jYXNzaXUiLCJhIjoiY2x1cW9qb3djMDBkNjJoa2NoMG1hbGsyNyJ9.nqTwoyg7Xf4v__5IwYzNDA';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/domoncassiu/cluqpx3gd00mj01pw53dhc6jp', // style URL
    center: start, // starting position [lng, lat]
    zoom: zoomlevel, // starting zoom
  });

  map.on('load', function () {
    // document.getElementById('loading').classList.add('hidden');
    const layers = map.getStyle().layers;
    layers.forEach(function (layer) {
      if (layer.layout && 'text-size' in layer.layout) {
        map.setLayoutProperty(layer.id, 'text-size', 25);
      }
    });
  });

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
  });

  map.addControl(geocoder);

  // change search text
  const search = document.querySelector('.mapboxgl-ctrl-geocoder--input');
  search.placeholder = 'Add Shelter Location';

  const geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  });

  map.addControl(geolocateControl, 'top-right');

  geocoder.on('result', function (e) {
    currentMarker = new mapboxgl.Marker({
      color: 'rgb(255, 119, 0)',
      scale: 1.5,
    })
      .setLngLat(e.result.geometry.coordinates)
      .addTo(map);

    var popup = new mapboxgl.Popup({
      offset: 60,
      closeOnMove: true,
      closeButton: false,
    })
      .setMaxWidth('300px')
      .setText(e.result.place_name);
    currentMarker.setPopup(popup);
    currentMarker.addTo(map).getPopup().addTo(map);

    sheltername = e.result.place_name;
    coordinates = e.result.geometry.coordinates;
    addShelter();
  });

  map.addControl(new mapboxgl.NavigationControl());

  // render incidents
  const incidents = await getIncidents();
  renderIncidents(map, incidents);

  // render shelters
  const shelters = await getShelter();
  console.log(shelters);
  all_markers = renderShelters(map, shelters);

  // socket listen rerender map
  socket.on('shelter', async (msg) => {
    const shelters = await getShelter();
    console.log(shelters);
    all_markers.forEach((marker) => marker.remove());
    all_markers = renderShelters(map, shelters);
  });

  // add button listener
  const button = document.getElementById('direction');

  button.addEventListener('click', async function () {
    await getRoute(map);
  });

  // add review listener

  // add delete listener
  const de = document.getElementById('delete');
  const re = document.getElementById('register');
  const sh = document.getElementById('shelternumber');
  const add = document.getElementById('increaseCapacity');
  const sub = document.getElementById('decreaseCapacity');

  const token = localStorage.getItem('token');
  const tokenParts = token.split('.');

  // The payload is the second part
  const payload = JSON.parse(atob(tokenParts[1]));
  if (payload['type'] === 'Citizen') {
    document.getElementById('add_sheltername').textContent =
      'Location Informaton';
    document.getElementById('shelternameinput').disabled = true;
    add.classList.add('hidden');
    sub.classList.add('hidden');
    de.classList.add('hidden');
    re.classList.add('hidden');
    sh.classList.add('hidden');
  } else {
    sub.classList.remove('hidden');
    add.classList.remove('hidden');
    de.classList.remove('hidden');
    re.classList.remove('hidden');
    sh.classList.remove('hidden');
  }

  de.addEventListener('click', function () {
    delShelter(map);
  });

  // trigger geolocate
  setTimeout(() => {
    geolocateControl.trigger();
  }, 1500);
}

// render shelter list
function renderShelters(map, shelters) {
  let markers = [];
  shelters.forEach((shelter) => {
    let marker = new mapboxgl.Marker({
      color: '#ffa3a3',
      scale: 1.5,
    })
      .setLngLat([shelter.longitude, shelter.latitude])
      .addTo(map);

    let popupContent = `
            <div>
                <h3 class="popupname">${shelter.name}</h3>
                <h4 class="popuptext">${shelter.address}</h4>
                <button id="${shelter.name}" class="popupbutton">View Details</button>
            </div>`;
    let popup = new mapboxgl.Popup({
      offset: 60,
      closeOnClick: true,
      closeOnMove: true,
      focusAfterOpen: true,
      closeButton: false,
    })
      .setMaxWidth('300px')
      .setHTML(popupContent);
    popup.on('open', () => {
      addPopupHandler();
    });
    marker.setPopup(popup);
    // marker.addTo(map).getPopup().addTo(map);
    markers.push(marker);
  });
  return markers;
}

// render incident list
function renderIncidents(map, incidents) {
  let markers = [];

  incidents.forEach((incident) => {
    let centerCoordinates = [incident.longitude, incident.latitude];
    let marker = new mapboxgl.Marker({
      color: 'red',
      scale: 1.5,
    })
      .setLngLat(centerCoordinates)
      .addTo(map);

    map.addSource(incident.name, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: centerCoordinates,
        },
      },
    });

    const metersToPixelsAtMaxZoom = (meters, latitude) =>
      meters / 0.075 / Math.cos((latitude * Math.PI) / 180);

    map.addLayer({
      id: incident.name,
      type: 'circle',
      source: incident.name,
      paint: {
        'circle-radius': {
          stops: [
            [0, 0],
            [20, metersToPixelsAtMaxZoom(1000, incident.latitude)],
          ],
          base: 2,
        },
        'circle-color': '#ffa3a3',
        'circle-opacity': 0.4,
      },
    });
    let redirect = './incident_page.html?incidentId=' + incident.incidentId;
    let popupContent = `
            <div>
                <h3 class="popupname">${incident.event}</h3>
                <h4 class="popuptext">${incident.incidentStatus}</h4>
                <button class="text-red-200" id="${incident.incidentId}" onclick="window.location.href='${redirect}'">View Details</button>
            </div>`;

    let popup = new mapboxgl.Popup({
      offset: 60,
      closeOnClick: true,
      closeOnMove: true,
      focusAfterOpen: true,
      closeButton: false,
    })
      .setMaxWidth('300px')
      .setHTML(popupContent);
    popup.on('open', () => {
      addPopupHandler();
    });
    marker.setPopup(popup);
    // marker.addTo(map).getPopup().addTo(map);
    markers.push(marker);
  });
  return markers;
}

// shelter popup view detail
async function shelter(id) {
  console.log(id);
  shelter_g = id;
  // popup
  showPopup();
  // update popup deatils
  const curr = await getShelter(1, 200, true, id);
  console.log(curr);
  dest_lat_g = curr[0].latitude;
  dest_lng_g = curr[0].longitude;
  document.getElementById('sheltername').textContent = id;
  document.getElementById('shelteraddress').textContent =
    'Address: ' + curr[0].address;
  document.getElementById('capacityNumber').textContent = curr[0].capacity;
  document.getElementById('shelterlocation').textContent =
    `Location: ${curr[0].latitude}, ${curr[0].longitude}`;

  console.log(curr[0].address);
  const ratings = await getThisShelterRatings(curr[0].address);
  let ratingblock = document.getElementById('ratingblock');
  // show rating
  if (ratings !== null) {
    ratingblock.classList.remove('hidden');
    let scoreblock = document.getElementById('shelterrating');
    let score = ratings.overall;
    scoreblock.textContent = score.toFixed(1);
  } else {
    ratingblock.classList.add('hidden');
  }
  // add rating listener
  ratingblock.addEventListener('click', function () {
    let encodedShelterId = encodeURIComponent(curr[0].address);
    window.location.href =
      './shelter_details_page.html?shelterId=' + encodedShelterId;
  });

  // add review listener
  review.addEventListener('click', function () {
    localStorage.setItem('shelterLocation', curr[0].address);
    window.location.href = './shelter_review_page.html';
  });

  // add album listener
  let album = document.getElementById('album');
  album.addEventListener('click', function () {
    let encodedShelterName = encodeURIComponent(id);
    window.location.href = './album_view.html?albumName=' + encodedShelterName;
  });

  // add resource listener
  let resource = document.getElementById('resource');
  resource.addEventListener('click', function () {
    let encodedShelterName = encodeURIComponent(curr[0].address);
    window.location.href =
      './resources_page_add.html?address=' + encodedShelterName;
  });
}

// add new shelter
async function addShelter() {
  showAddPopup();
  document.getElementById('add_shelteraddress').textContent = sheltername;
}

async function getRoute(map) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${cur_lng_g},${cur_lat_g};${dest_lng_g},${dest_lat_g}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`,

    { method: 'GET' },
  );

  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  drawRoute(route, map);
  back();
}

function drawRoute(route, map) {
  if (map.getSource('route')) {
    map.getSource('route').setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route,
      },
    });
  } else {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ffa3a3',
        'line-width': 8,
      },
    });
  }
}

// handle back button
function back() {
  const shelter_dialog = document.getElementById('shelter_dialog');
  const shelter_panel = document.getElementById('shelter_panel');

  // pop up for confirmation
  shelter_dialog.classList.remove('visible');
  shelter_dialog.classList.add('invisible');

  shelter_panel.classList.remove(
    'opacity-100',
    'translate-y-0',
    'sm:scale-100',
  );
  shelter_panel.classList.add(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  shelter_panel.classList.remove('ease-in', 'duration-200');
  shelter_panel.classList.add('ease-out', 'duration-300');
}

// handle back button
function cancel() {
  if (currentMarker) {
    currentMarker.remove();
    currentMarker = null;
  }

  const add_shelter_dialog = document.getElementById('add_shelter_dialog');
  const add_shelter_panel = document.getElementById('add_shelter_panel');

  // pop up for confirmation
  add_shelter_dialog.classList.remove('visible');
  add_shelter_dialog.classList.add('invisible');

  add_shelter_panel.classList.remove(
    'opacity-100',
    'translate-y-0',
    'sm:scale-100',
  );
  add_shelter_panel.classList.add(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  add_shelter_panel.classList.remove('ease-in', 'duration-200');
  add_shelter_panel.classList.add('ease-out', 'duration-300');
}

// handle button change capacity
async function update(change) {
  const capacity = document.getElementById('capacityNumber');
  let curr = parseInt(capacity.textContent);
  if (change === 'increase') {
    curr++;
  } else if (change === 'decrease' && curr > 0) {
    curr--;
  }
  capacity.textContent = curr;

  await updateShelter(shelter_g, curr);
}

// handle button delete
async function delShelter(map) {
  await deleteShelter(shelter_g);
  if (map.getLayer('route')) {
    map.removeLayer('route');
  }
  if (map.getSource('route')) {
    map.removeSource('route');
  }

  back();
}

// handle button register
async function register() {
  const name = document.getElementById('shelternameinput').value;
  const number = parseFloat(document.getElementById('shelternumber').value);
  const address = document.getElementById('add_shelteraddress').textContent;
  const shelter_error = document.getElementById('add_sheltererror');
  if (number < 0 || isNaN(number)) {
    shelter_error.textContent = 'Availability must be positive';
  } else if (name.length < 3 || name == '') {
    shelter_error.textContent = 'Name is not valid';
  } else {
    shelter_error.textContent = '';
    console.log(name, number, coordinates[0], coordinates[1]);
    // call add shelter
    await createAblum(name);
    await postShelter(name, address, number, coordinates[0], coordinates[1]);
    cancel();
  }
}

// show popup
function showPopup() {
  // pop up for shelter
  const shelter_dialog = document.getElementById('shelter_dialog');
  const shelter_panel = document.getElementById('shelter_panel');

  shelter_dialog.classList.remove('invisible');
  shelter_dialog.classList.add('visible');

  shelter_panel.classList.remove(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  shelter_panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
  shelter_panel.classList.remove('ease-out', 'duration-300');
  shelter_panel.classList.add('ease-in', 'duration-200');
}

// show add shelter popup
function showAddPopup() {
  // pop up for shelter
  const add_shelter_dialog = document.getElementById('add_shelter_dialog');
  const add_shelter_panel = document.getElementById('add_shelter_panel');
  const shelterinput = document.getElementById('shelternameinput');
  const shelternumber = document.getElementById('shelternumber');

  shelterinput.value = sheltername.split(',')[0];
  shelternumber.value = '';

  add_shelter_dialog.classList.remove('invisible');
  add_shelter_dialog.classList.add('visible');

  add_shelter_panel.classList.remove(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  add_shelter_panel.classList.add(
    'opacity-100',
    'translate-y-0',
    'sm:scale-100',
  );
  add_shelter_panel.classList.remove('ease-out', 'duration-300');
  add_shelter_panel.classList.add('ease-in', 'duration-200');
}

function addPopupHandler() {
  // add event listener to popup buttons
  let popupbuttons = document.querySelectorAll('.popupbutton');
  console.log(popupbuttons);

  popupbuttons.forEach(async function (button) {
    console.log(button);
    button.addEventListener('click', async function () {
      await shelter(this.id);
    });
  });
}
