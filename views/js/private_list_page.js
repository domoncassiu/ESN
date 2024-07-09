import { setupDialog, read, showPopup, renderUser } from './utils.js';
import { getUsers, acknowledge } from './endpoints.js';

document.addEventListener('DOMContentLoaded', async function () {
  setupDialog();

  const listButton = document.getElementById('modal3_next');
  listButton.addEventListener('click', function () {
    acknowledge();
  });

  const listConfirm = document.getElementById('confirm');

  listConfirm.addEventListener('click', function () {
    read();
  });

  // handle socket io
  let ENDPOINT;
  if (window.location.hostname === 'localhost') {
    ENDPOINT = 'http://localhost:3000';
  } else {
    ENDPOINT = 'https://s24esnb5.onrender.com';
  }
  console.log('list endpoint set: ', ENDPOINT);
  const socket = io(ENDPOINT, {
    origin: window.location.hostname,
    auth: {
      token: localStorage.getItem('token'),
    },
    transports: ['websocket'],
  });
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
      const data = await getUsers();
      updateUser(data.unread, data.read);
    } else {
      localStorage.setItem('token', msg.newToken);
    }
  });

  socket.on('connect_error', (err) => {
    console.log(err.message);
    window.location.href = './register_page.html';
  });

  socket.on('private', async (msg) => {
    console.log('private message received:', msg);
    // check if the sender is the current one
    showPopup(msg.sender);

    // call the fetch new list again and update the html
    const data = await getUsers();
    updateUser(data.unread, data.read);
  });

  socket.on('read', async (msg) => {
    console.log('read message received:', msg);
    // check if the sender is the current one
    const data = await getUsers();
    updateUser(data.unread, data.read);
  });

  socket.on('testing', (msg) => {
    console.log('test start:', msg);
    // check if the sender is the current one
    window.location.href = './pause_page.html';
  });

  // get all the Users
  const data = await getUsers();
  updateUser(data.unread, data.read);
});

// ----- helper functions -----
// close popup

// the message popups
// update the message html
function updateUser(unread, read) {
  document.getElementById('unread').innerHTML = '';
  document.getElementById('read').innerHTML = '';

  console.log('unread:', unread);
  unread.forEach((user) => {
    let userDiv1 = renderUser(user);

    const paragraph = document.createElement('p');
    paragraph.classList.add('font-8', 'ml-1');
    paragraph.textContent = user.username;

    userDiv1.appendChild(paragraph);
    document.getElementById('unread').appendChild(userDiv1);
  });

  read.forEach((user) => {
    let userDiv2 = renderUser(user);

    const paragraph = document.createElement('p');
    const arrowImg = document.createElement('img');
    arrowImg.src = '../images/right-arrow.svg';
    arrowImg.width = 30;
    arrowImg.style.marginLeft = 40 + 'px';
    arrowImg.classList.add('arrow-icon');
    paragraph.classList.add('font-8', 'text-iconFont', 'ml-1');
    paragraph.textContent = user.username;
    userDiv2.appendChild(paragraph);
    userDiv2.appendChild(arrowImg);
    document.getElementById('read').appendChild(userDiv2);
  });
}

// ---- calling endpoints ----
