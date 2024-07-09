// ---- run on every refresh ----
import {
  setupMessageContainer,
  updateMessage,
  read,
  showPopup,
} from './utils.js';
import {
  postPrivateMessage,
  getPrivateMessages,
  readMessage,
  acknowledge,
  initializeSocket,
} from './endpoints.js';

// on page load
document.addEventListener('DOMContentLoaded', async function () {
  const privateButton = document.getElementById('modal3_next');
  privateButton.addEventListener('click', function () {
    acknowledge();
  });

  const privatConfirm = document.getElementById('confirm');
  privatConfirm.addEventListener('click', function () {
    read();
  });

  // establish socket connection
  const socket = await initializeSocket();

  socket.on('infochange', async (msg) => {
    console.log('info:', msg.userId, 'active:', msg.isActive);
    const token = localStorage.getItem('token');
    const tokenParts = token.split('.');
    // The payload is the second part
    const payload = JSON.parse(atob(tokenParts[1]));
    const currUser = payload['_id'];

    if (currUser === msg.userId && msg.isActive === false) {
      window.location.href = './admin_page.html';
    } else if (currUser != msg.userID) {
      await readMessage(username);
      setupMessageContainer(initial);
    } else {
      localStorage.setItem('token', msg.newToken);
    }
  });

  socket.on('testing', (msg) => {
    console.log('test start:', msg);
    // check if the sender is the current one
    window.location.href = './pause_page.html';
  });

  socket.on('private', (msg) => {
    console.log('private message received:', msg);

    // check if the sender is the current one
    if (msg.receiver === localStorage.getItem('username')) {
      // read the message
      // readMessage(msg.receiver);

      // update html
      const messagesContainer = document.getElementById('messageContainer');
      const messageElement = updateMessage(msg);
      messagesContainer.appendChild(messageElement);
      // scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else if (msg.sender === localStorage.getItem('username')) {
      // read the message
      readMessage(msg.sender);

      // update html
      const messagesContainer = document.getElementById('messageContainer');
      const messageElement = updateMessage(msg);
      messagesContainer.appendChild(messageElement);
      // scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });

  // read the message
  // // get all the messages
  let userId = localStorage.getItem('userId');
  const initial = await getPrivateMessages(userId);
  console.log('start read');
  await readMessage(userId);
  console.log(initial);

  // update html to display messages
  setupMessageContainer(initial);

  // bind click send function
  const input = document.getElementById('publicchat');
  // send message when return is pressed
  input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      clickSendPrivate();
    }
  });
});

// ---- helper functions ----
// ---- onclick functions ----

// handle the send message button click event

async function clickSendPrivate() {
  const textbox = document.getElementById('publicchat');
  const message = textbox.value;
  console.log(message);

  if (message == '') {
    textbox.placeholder = 'Please enter your message';
  } else {
    // post the message
    let userId = localStorage.getItem('userId');
    const new_message = await postPrivateMessage(message, userId);
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
}

// ---- calling endpoints ----
