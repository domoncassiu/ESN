import { read, showPopup } from './utils.js';
import {
  getIncidents,
  initializeSocket,
  subscribeToPrivateAndTesting,
} from './endpoints.js';

document.addEventListener('DOMContentLoaded', async function () {
  const myButton = document.getElementById('confirm');

  myButton.addEventListener('click', function () {
    read();
  });

  const createNewIncidentButton = document.getElementById(
    'create_new_incident_button',
  );
  createNewIncidentButton.addEventListener('click', function () {
    window.location.href = './create_incident_page.html';
  });

  // establish socket connection
  let socket = await initializeSocket();
  socket = await subscribeToPrivateAndTesting(socket);

  // // get all the messages
  const initial = await getIncidents();
  console.log('Incidents: ', initial);

  // update html to display messages
  if (initial) {
    // get the html by id
    const incidentsContainer = document.getElementById('incidentsContainer');
    initial.forEach((incident) => {
      // call the update function
      const incidentElement = updateIncident(incident);
      incidentsContainer.appendChild(incidentElement);
      incidentElement.scrollIntoView(false);
    });
  }
});

// ---- helper functions ----

function openIncident(incidentId) {
  window.location.href = `./incident_page.html?incidentId=${incidentId}`;
}

// add message block
export function updateIncident(incident) {
  const incidentCard = document.createElement('div');
  const active = 'bg-red-100';
  const archived = 'bg-stone-100';
  incidentCard.classList.add(
    'p-7',
    'flex',
    'flex-col',
    'gap-2.5',
    'w-full',
    'leading-1.5',
    'p-4',
    'border-gray-200',
    incident.incidentStatus === 'Active' ? active : archived,
    'rounded-e-4xl',
    'rounded-es-4xl',
    'mb-7',
  );

  const messageInfo = document.createElement('div');
  messageInfo.classList.add(
    'text-4xl',
    'flex',
    'flex-col',
    'items-center',
    'space-x-2',
    'rtl:space-x-reverse',
    'justify-between',
  );

  messageInfo.addEventListener(
    'click',
    function () {
      openIncident(incident.incidentId);
    },
    false,
  );

  const date = new Date(incident.timestamp);

  const nameElement = document.createElement('span');
  nameElement.classList.add('font-bold-300', 'text-black', 'self-start');
  nameElement.textContent = incident.name;

  const eventElement = document.createElement('span');
  eventElement.classList.add(
    'font-30',
    'text-gray-500',
    'self-start',
    'dark:text-gray-500',
  );
  eventElement.textContent = '[' + incident.event + ']';

  const timestamp = document.createElement('span');
  timestamp.classList.add('font-30', 'text-2xl', 'text-black', 'self-end');
  timestamp.textContent = date.toDateString();

  const locationElement = document.createElement('p');
  locationElement.classList.add(
    'font-7',
    'font-bold-300',
    'dark:text-gray-500',
    'self-start',
  );
  locationElement.textContent = incident.longitude + ' ' + incident.latitude;

  messageInfo.appendChild(nameElement);
  messageInfo.appendChild(eventElement);
  messageInfo.appendChild(locationElement);

  incidentCard.appendChild(messageInfo);
  incidentCard.appendChild(timestamp);

  return incidentCard;
}
