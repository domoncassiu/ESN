import {
  getAllUsers,
  getNewMessages,
  acknowledge,
  initializeSocket,
} from './endpoints.js';
import { setupDialog, read, showPopup, renderUser } from './utils.js';

document.addEventListener('DOMContentLoaded', async function () {
  setupDialog();

  const myButton = document.getElementById('modal3_next');

  myButton.addEventListener('click', function () {
    acknowledge();
  });

  const confirm_new = document.getElementById('confirm_new');

  confirm_new.addEventListener('click', function () {
    readNew();
  });

  const confirm = document.getElementById('confirm');

  confirm.addEventListener('click', function () {
    read();
  });

  const token = localStorage.getItem('token');
  const tokenParts = token.split('.');
  // The payload is the second part
  const payload = JSON.parse(atob(tokenParts[1]));
  console.log(payload['type']);
  let admin = document.getElementById('admin_button');
  let test = document.getElementById('test_button');
  if (payload['type'] === 'Citizen') {
    admin.style.display = 'none';
    test.style.display = 'none';
  }

  // handle socket io
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
      // get all the Users
      const userlist = await getAllUsers();
      // update html to display Users
      updateUser(userlist);
    } else {
      localStorage.setItem('token', msg.newToken);
    }
  });

  socket.on('online status', async (msg) => {
    // update html

    // fetch userlists
    const userlist = await getAllUsers();

    updateUser(userlist);
  });

  socket.on('private', (msg) => {
    console.log('private message received:', msg);
    // check if the sender is the current one
    showPopup(msg.sender);
  });

  socket.on('testing', (msg) => {
    console.log('test start:', msg);
    // check if the sender is the current one
    window.location.href = './pause_page.html';
  });

  // fetch the new messages
  const newmessage = await getNewMessages();
  console.log('new messages:', newmessage);
  var usernames = newmessage
    .map(function (user) {
      return user.username;
    })
    .join(', ');
  if (usernames.length > 0) {
    showNew(usernames);
  }

  // get all the Users
  const userlist = await getAllUsers();
  // update html to display Users
  updateUser(userlist);
});

// ----- helper functions -----

// new message popup
function readNew() {
  const confirm_panel = document.getElementById('login_panel');
  const dialog = document.getElementById('login_dialog');
  const confirm_back = document.getElementById('confirm_back');

  // pop up for confirmation
  dialog.classList.remove('visible');
  dialog.classList.add('invisible');

  confirm_panel.classList.remove(
    'opacity-100',
    'translate-y-0',
    'sm:scale-100',
  );
  confirm_panel.classList.add(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  confirm_back.classList.remove('opacity-100');
  confirm_back.classList.add('opacity-0');

  confirm_back.classList.remove('ease-in', 'duration-200');
  confirm_back.classList.add('ease-out', 'duration-300');

  confirm_panel.classList.remove('ease-in', 'duration-200');
  confirm_panel.classList.add('ease-out', 'duration-300');
}

// the message popups
function showNew(username) {
  const confirm_panel = document.getElementById('login_panel');
  const dialog = document.getElementById('login_dialog');
  const text = document.getElementById('login_text');
  const confirm_back = document.getElementById('confirm_back');

  text.textContent = `${username} just sent you a message!`;

  dialog.classList.remove('invisible');
  dialog.classList.add('visible');

  confirm_panel.classList.remove(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  confirm_panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
  confirm_back.classList.remove('opacity-0');
  confirm_back.classList.add('opacity-100');

  confirm_back.classList.remove('ease-out', 'duration-300');
  confirm_back.classList.add('ease-in', 'duration-200');

  confirm_panel.classList.remove('ease-out', 'duration-300');
  confirm_panel.classList.add('ease-in', 'duration-200');
}

// update the message html
function updateUser(userlist) {
  document.getElementById('Online').innerHTML = '';
  document.getElementById('Offline').innerHTML = '';
  userlist.sort((a, b) => a.username.localeCompare(b.username));

  userlist.forEach((user) => {
    if (user.isActive === true) {
      let userDiv = renderUser(user);

      const paragraph = document.createElement('p');

      if (user.onlineStatus === 'Online') {
        paragraph.classList.add('font-8', 'ml-1');
      } else {
        paragraph.classList.add('font-8', 'text-iconFont', 'ml-1');
      }
      paragraph.textContent = user.username;
      const arrowImg = document.createElement('img');
      arrowImg.src = '../images/right-arrow.svg';
      arrowImg.width = 30;
      arrowImg.style.marginLeft = 40 + 'px';
      arrowImg.classList.add('arrow-icon');
      userDiv.appendChild(paragraph);
      userDiv.appendChild(arrowImg);

      if (user.onlineStatus === 'Online') {
        document.getElementById('Online').appendChild(userDiv);
      } else {
        document.getElementById('Offline').appendChild(userDiv);
      }
    }
  });
}

// ---- calling endpoints ----
