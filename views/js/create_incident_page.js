import { read, showPopup } from './utils.js';
import {
  createIncident,
  initializeSocket,
  subscribeToPrivateAndTesting,
} from './endpoints.js';

document.addEventListener('DOMContentLoaded', async function () {
  const myButton = document.getElementById('confirm');

  myButton.addEventListener('click', function () {
    read();
  });

  // establish socket connection
  let socket = await initializeSocket();
  socket = await subscribeToPrivateAndTesting(socket);

  // Register on-click events
  const createIncidentButton = document.getElementById(
    'create_incident_button',
  );
  createIncidentButton.addEventListener(
    'click',
    function () {
      createNewIncident();
    },
    false,
  );
});

// ---- helper functions ----

async function createNewIncident() {
  console.log('Creating new incident');
  const incidentName = document.getElementById('incidentName').value;
  const incidentEvent = document.getElementById('incidentEvent').value;
  const errorMessage = document.getElementById('errorMessage');

  function getLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(
        submitCreateIncident,
        showError,
      );
    }
    return null;
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage.innerText =
          'User denied the request for Geolocation. Cannot create incident without your location.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage.innerText =
          'Location information is unavailable. Cannot create incident without your location.';
        break;
      case error.TIMEOUT:
        errorMessage.innerText =
          'The request to get user location timed out. Cannot create incident without your location.';
        break;
      case error.UNKNOWN_ERROR:
        errorMessage.innerText =
          'An unknown error occurred. Cannot create incident without your location.';
        break;
    }
  }

  getLocation();

  async function submitCreateIncident(position) {
    await createIncident(
      incidentName,
      incidentEvent,
      position.coords.longitude,
      position.coords.latitude,
    );

    window.location.href = `./incident_directory.html`;
  }
}
