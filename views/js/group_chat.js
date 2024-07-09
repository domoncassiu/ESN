// ---- run on every refresh ----
import {
  setupMessageContainer,
  updateMessage,
  showPopup,
  read,
} from './utils.js';
import {
  postGroupMessage,
  acknowledge,
  getGroupMessages,
  getIncident,
} from './endpoints.js';

// on page load
document.addEventListener('DOMContentLoaded', async function () {
  const chat_confirm = document.getElementById('confirm');
  chat_confirm.addEventListener('click', function () {
    read();
  });

  // handle modal popup
  const ack = document.getElementById('modal3_next');

  ack.addEventListener('click', function () {
    acknowledge();
  });

  const queryStringParams = new URLSearchParams(window.location.search);
  const incidentId = queryStringParams.get('incidentId');
  if (incidentId === null || incidentId === undefined) {
    return;
  }

  // // get all the messages
  let isModerator = false;
  const incident = await getIncident(incidentId);
  console.log('Incident: ', incident);
  console.log('local userr:', localStorage.getItem('username'));
  if (localStorage.getItem('username') === incident.moderator.username) {
    isModerator = true;
  }
  const messagesContainer = document.getElementById('messageContainer');

  // establish socket connection
  let ENDPOINT;
  if (window.location.hostname === 'localhost') {
    ENDPOINT = 'http://localhost:3000';
  } else {
    ENDPOINT = 'https://s24esnb5.onrender.com';
  }
  const socket = io(ENDPOINT, {
    origin: window.location.hostname,
    auth: {
      token: localStorage.getItem('token'),
    },
    transports: ['websocket'],
  });
  socket.on('group', (msg) => {
    console.log('received: ', msg);
    if (msg.incidentId === incidentId) {
      // update html
      const messageElement = updateMessage(msg, isModerator);
      messagesContainer.appendChild(messageElement);
      // scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
  socket.on('connect_error', (err) => {
    console.log(err.message);
    window.location.href = './register_page.html';
  });

  socket.on('private', (msg) => {
    console.log('private message received:', msg);
    // check if the sender is the current one
    showPopup(msg.sender);
  });

  // check if test start
  socket.on('testing', (msg) => {
    console.log('test start:', msg);
    // check if the sender is the current one
    window.location.href = './pause_page.html';
  });

  console.log('gp isModerator:', isModerator);
  const initial = await getGroupMessages(incidentId);
  console.log(initial);

  // update html to display messages
  setupMessageContainer(initial, 'groupChat', isModerator);

  // bind click send function
  const input = document.getElementById('groupChat');
  // send message when return is pressed
  input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      clickSend(incidentId);
    }
  });
});

// ---- helper functions ----
// handle the play animation
function playsend() {
  // const svg = document.getElementById('sendicon');
  // svg.classList.add('shake');

  // setTimeout(function () {
  //   svg.classList.remove('shake');
  // }, 500);
  console.log('play send');
}

// ---- onclick functions ----

// handle the send message button click event
async function clickSend(incidentId) {
  console.log('clicked send');
  const textbox = document.getElementById('groupChat');
  let messageBody = {};
  const message = textbox.value;
  console.log(message);

  if (message == '') {
    textbox.placeholder = 'Please enter your message';
  } else {
    // post the message
    messageBody['message'] = message;
    const new_message = await postGroupMessage(incidentId, messageBody);
    console.log('here is the new message', new_message);

    // check if message sent successfully
    // clear the input
    const input = document.getElementById('groupChat');
    input.value = '';
    input.blur();
    if (new_message) {
    } else {
      console.log('Failed to send message');
      textbox.placeholder = 'Failed to send message';
    }
  }
  playsend();
}

// ---- calling endpoints ----
