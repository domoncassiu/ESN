// ---- run on every refresh ----
import {
  setupMessageContainer,
  updateMessage,
  showPopup,
  read,
} from './utils.js';
import {
  postMessage,
  getMessage,
  acknowledge,
  initializeSocket,
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

  // establish socket connection
  const socket = await initializeSocket();
  socket.on('infochange', async (msg) => {
    console.log('info change received:', msg);
    // check if the sender is the current one
    console.log('info:', msg.userId, 'active:', msg.isActive);

    const token = localStorage.getItem('token');
    const tokenParts = token.split('.');
    // The payload is the second part
    const payload = JSON.parse(atob(tokenParts[1]));
    const currUser = payload['_id'];

    if (currUser === msg.userId && msg.isActive === false) {
      window.location.href = './admin_page.html';
    } else if (currUser != msg.userID) {
      const initial = await getMessage();
      setupMessageContainer(initial);
    } else {
      localStorage.setItem('token', msg.newToken);
    }
  });

  socket.on('chat message', (msg) => {
    // update html
    const messagesContainer = document.getElementById('messageContainer');
    const messageElement = updateMessage(msg);
    messagesContainer.appendChild(messageElement);
    // scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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

  // // get all the messages
  const initial = await getMessage();
  console.log(initial);

  // update html to display messages
  setupMessageContainer(initial);

  // bind click send function
  const input = document.getElementById('publicchat');
  // send message when return is pressed
  input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      clickSendPublic();
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
async function clickSendPublic() {
  const textbox = document.getElementById('publicchat');
  const message = textbox.value;
  console.log(message);

  if (message == '') {
    textbox.placeholder = 'Please enter your message';
  } else {
    // post the message
    const new_message = await postMessage(message);
    console.log('here is the new message', new_message);

    // check if message sent successfully
    if (new_message) {
      // clear the input
      const input = document.getElementById('publicchat');
      input.value = '';
      input.blur();
    } else {
      console.log('Failed to send message');
      textbox.placeholder = 'Failed to send message';
    }
  }
  playsend();
}

// ---- calling endpoints ----
