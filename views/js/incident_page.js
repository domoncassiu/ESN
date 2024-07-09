import { read, showPopup } from './utils.js';
import {
  getIncident,
  initializeSocket,
  joinIncident,
  leaveIncident,
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

  // // get all the messages
  const queryStringParams = new URLSearchParams(window.location.search);
  const incidentId = queryStringParams.get('incidentId');
  if (incidentId === null || incidentId === undefined) {
    return;
  }

  // Register on-click events
  const groupChatButton = document.getElementById('group_chat_button');
  groupChatButton.addEventListener(
    'click',
    function () {
      goToGroupChat(incidentId);
    },
    false,
  );

  const joinIncidentButton = document.getElementById('join_incident_button');
  joinIncidentButton.addEventListener(
    'click',
    function () {
      joinThisIncident(incidentId);
    },
    false,
  );

  const incident = await getIncident(incidentId);
  console.log('Incident: ', incident);

  const leaveIncidentButton = document.getElementById('leave_incident_button');
  leaveIncidentButton.addEventListener('click', function () {
    leaveIncident(incidentId);
    window.location.href = './incident_directory.html';
  });

  // update html to display messages
  if (incident) {
    updateView(incident);
  }
});

// ---- helper functions ----
async function joinThisIncident(incidentId) {
  await joinIncident(incidentId);
  goToGroupChat(incidentId);
}

function goToGroupChat(incidentId) {
  window.location.href = `./group_chat_page.html?incidentId=${incidentId}`;
}

export function updateView(incident) {
  const entryColor = 'text-stone-900';

  const incidentName = document.getElementById('name');
  incidentName.classList.add(entryColor);
  incidentName.innerText = incident.name;

  const incidentTimestamp = document.getElementById('timestamp');
  let d = new Date(incident.timestamp);
  incidentTimestamp.classList.add(entryColor);
  incidentTimestamp.innerText = d.toDateString();

  const incidentEvent = document.getElementById('event');
  incidentEvent.classList.add(entryColor);
  incidentEvent.innerText = incident.event;

  const incidentLocation = document.getElementById('location');
  incidentLocation.classList.add(entryColor);
  incidentLocation.innerText = incident.longitude + ' ' + incident.latitude;

  const incidentStatus = document.getElementById('status');
  if (incident.incidentStatus === 'Active') {
    incidentStatus.classList.add('text-red-400');
  } else {
    incidentStatus.classList.add(entryColor);
  }
  incidentStatus.innerText = incident.incidentStatus;

  const moderator = document.getElementById('moderator');
  const moderatorElement = document.createElement('user-component');
  moderatorElement.setAttribute('username', incident.moderator.username);
  moderatorElement.setAttribute('userId', incident.moderator._id);
  moderatorElement.setAttribute(
    'safetyStatus',
    incident.moderator.safetyStatus,
  );
  moderatorElement.setAttribute('center', 'true');
  moderator.appendChild(moderatorElement);

  const incidentMembers = document.getElementById('membersList');
  for (var member of incident.membersListData) {
    const memberElement = document.createElement('user-component');
    memberElement.setAttribute('username', member.username);
    memberElement.setAttribute('userId', member._id);
    memberElement.setAttribute('safetyStatus', member.safetyStatus);
    memberElement.setAttribute('center', 'true');
    incidentMembers.appendChild(memberElement);
  }

  const groupChatButton = document.getElementById('groupChat');
  const joinIncidentButton = document.getElementById('joinIncident');
  const leaveIncidentButton = document.getElementById('leave_incident_button');
  if (incident.isMember) {
    joinIncidentButton.style.display = 'none';
    groupChatButton.style.display = 'flex';
    leaveIncidentButton.style.display = 'flex';
  } else {
    joinIncidentButton.style.display = 'flex';
    groupChatButton.style.display = 'none';
    leaveIncidentButton.style.display = 'none';
  }
}
