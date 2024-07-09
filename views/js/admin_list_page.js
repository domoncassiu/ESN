import { read, showPopup, renderUser } from './utils.js';
import { getAllUsers, validateInfo, modifyInfo } from './endpoints.js';

let selected_type = '';
let selected_status = '';
let currId = '';
let userlist = [];

document.addEventListener('DOMContentLoaded', async function () {
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

  //   socket.on('connect_error', (err) => {
  //     console.log(err.message);
  //     window.location.href = './register_page.html';
  //   });

  //   socket.on('private', async (msg) => {
  //     console.log('private message received:', msg);
  //     // check if the sender is the current one
  //     showPopup(msg.sender);

  //     // call the fetch new list again and update the html
  //     const data = await getUsers();
  //     updateUser(data.unread, data.read);
  //   });

  //   socket.on('read', async (msg) => {
  //     console.log('read message received:', msg);
  //     // check if the sender is the current one
  //     const data = await getUsers();
  //     updateUser(data.unread, data.read);
  //   });

  socket.on('testing', (msg) => {
    console.log('test start:', msg);
    // check if the sender is the current one
    window.location.href = './pause_page.html';
  });

  // get all the Users
  userlist = await getAllUsers();
  console.log('data:', userlist);
  displayUsers(userlist);

  // hanlde validate
  const validate = document.getElementById('validateUser');
  validate.addEventListener('click', async function () {
    const currUsername = document.getElementById('currUsername').value;
    const currPassword = document.getElementById('currPassword').value;
    // console.log('currUsername:', currUsername, 'currPassword:', currPassword, 'selected_type:', selected_type, 'selected_status:', selected_status, 'currId:', currId);
    await validateCurr(
      currUsername,
      currPassword,
      selected_type,
      selected_status,
      currId,
    );
  });

  //handle modify
  const modify = document.getElementById('modify');
  modify.addEventListener('click', async function () {
    const validation = document.getElementById('validateError');
    const currUsername = document.getElementById('currUsername').value;
    const currPassword = document.getElementById('currPassword').value;
    let currState = false;
    validation.textContent = '';
    if (selected_status === 'Active') {
      currState = true;
    }
    let data = await validateInfo(
      currUsername,
      currPassword,
      selected_type,
      currId,
    );
    if (data === 'validtion successful') {
      await modifyCurr(
        currUsername,
        currPassword,
        selected_type,
        currState,
        currId,
      );
    }
    hideModify();
    close_edit_dialog();
    userlist = await getAllUsers();
    displayUsers(userlist);
  });
});

// helper
// update the message html
function displayUsers(userlist) {
  document.getElementById('allUsers').innerHTML = '';

  userlist.forEach((user) => {
    let userDiv = renderUser(user, 'edit');

    const paragraph = document.createElement('p');
    paragraph.classList.add('font-8', 'ml-1');
    paragraph.textContent = user.username;
    userDiv.appendChild(paragraph);
    document.getElementById('allUsers').appendChild(userDiv);
  });
}

export async function render_edit_dialog(username) {
  let open = false;
  let statusOpen = false;

  // call endpoint
  let curr = userlist.find((user) => user.username === username);
  console.log('curr:', curr.userId);

  // render the chat dialog
  const user_dialog = document.getElementById('edit_profile_dialog');
  const user_panel = document.getElementById('edit_profile_panel');
  const user_name = document.getElementById('currUsername');
  const user_password = document.getElementById('currPassword');
  const validate = document.getElementById('validateUser');
  const currtype = document.getElementById('currType');
  const currstatus = document.getElementById('currStatus');
  const type_button = document.getElementById('type_button');
  const status_button = document.getElementById('status_button');
  const Citizen = document.getElementById('Citizen');
  const Admin = document.getElementById('Admin');
  const Coordinator = document.getElementById('Coordinator');
  const Active = document.getElementById('Active');
  const Inactive = document.getElementById('Inactive');
  const confirm_back = document.getElementById('edit_profile_backdrop');

  selected_type = curr.type;
  if (curr.isActive === true) {
    selected_status = 'Active';
  } else {
    selected_status = 'Inactive';
  }
  currstatus.textContent = selected_status;
  currtype.textContent = selected_type;
  user_name.value = curr.username;
  user_password.value = '';

  // handle dropdown click
  type_button.addEventListener('click', function () {
    if (open) {
      closeDropdown();
      open = false;
    } else {
      openDropdown();
      open = true;
    }
  });
  addColor(selected_type);

  // handle dropdown selection
  Citizen.addEventListener('click', function () {
    removeColor(selected_type);
    selected_type = 'Citizen';
    currtype.textContent = selected_type;
    addColor(selected_type);
    closeDropdown();
  });

  Admin.addEventListener('click', function () {
    removeColor(selected_type);
    selected_type = 'Admin';
    currtype.textContent = selected_type;
    addColor(selected_type);
    closeDropdown();
  });

  Coordinator.addEventListener('click', function () {
    removeColor(selected_type);
    selected_type = 'Coordinator';
    currtype.textContent = selected_type;
    addColor(selected_type);
    closeDropdown();
  });

  // handle status button
  status_button.addEventListener('click', function () {
    if (statusOpen) {
      closeStatusDropdown();
      statusOpen = false;
    } else {
      openStatusDropdown();
      statusOpen = true;
    }
  });
  // add color
  addStatusColor(selected_status);

  // handle dropdown selectio
  Active.addEventListener('click', function () {
    removeStatusColor(selected_status);
    selected_status = 'Active';
    currstatus.textContent = selected_status;
    addStatusColor(selected_status);
    closeStatusDropdown();
  });

  Inactive.addEventListener('click', function () {
    removeStatusColor(selected_status);
    selected_status = 'Inactive';
    currstatus.textContent = selected_status;
    addStatusColor(selected_status);
    closeStatusDropdown();
  });

  // render the edit dialog
  user_dialog.classList.remove('invisible');
  user_dialog.classList.add('visible');

  user_panel.classList.remove(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  user_panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
  user_panel.classList.remove('ease-out', 'duration-300');
  user_panel.classList.add('ease-in', 'duration-200');

  confirm_back.classList.remove('opacity-0');
  confirm_back.classList.add('opacity-100');

  confirm_back.classList.remove('ease-out', 'duration-300');
  confirm_back.classList.add('ease-in', 'duration-200');

  // handle close
  const cancel = document.getElementById('cancel');
  cancel.addEventListener('click', async function () {
    close_edit_dialog();
    removeColor(selected_type);
    removeStatusColor(selected_status);
    userlist = await getAllUsers();
    displayUsers(userlist);
  });

  //handle validate
  currId = curr.userId;
}

// render color helper
function addColor(type) {
  const curr = document.getElementById(type);
  curr.classList.remove('text-gray-900');
  curr.classList.add('bg-indigo-600', 'text-white');
}

function removeColor(type) {
  const curr = document.getElementById(type);
  curr.classList.remove('bg-indigo-600', 'text-white');
  curr.classList.add('text-gray-900');
}

function addStatusColor(type) {
  const curr = document.getElementById(type);
  curr.classList.remove('text-gray-900');
  curr.classList.add('bg-indigo-600', 'text-white');
}

function removeStatusColor(type) {
  const curr = document.getElementById(type);
  curr.classList.remove('bg-indigo-600', 'text-white');
  curr.classList.add('text-gray-900');
}

function openDropdown() {
  const type_dropdown = document.getElementById('type_dropdown');
  type_dropdown.classList.remove('invisible');
  type_dropdown.classList.add('visible');
}

function closeDropdown() {
  const type_dropdown = document.getElementById('type_dropdown');
  type_dropdown.classList.remove('visible');
  type_dropdown.classList.add('invisible');
}

function openStatusDropdown() {
  const status_dropdown = document.getElementById('status_dropdown');
  status_dropdown.classList.remove('invisible');
  status_dropdown.classList.add('visible');
}

function closeStatusDropdown() {
  const status_dropdown = document.getElementById('status_dropdown');
  status_dropdown.classList.remove('visible');
  status_dropdown.classList.add('invisible');
}

// close edit dialog
function close_edit_dialog() {
  const user_dialog = document.getElementById('edit_profile_dialog');
  const user_panel = document.getElementById('edit_profile_panel');
  const confirm_back = document.getElementById('edit_profile_backdrop');

  user_panel.classList.remove('opacity-100', 'translate-y-0', 'sm:scale-100');
  user_panel.classList.add(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  user_panel.classList.remove('ease-in', 'duration-200');
  user_panel.classList.add('ease-out', 'duration-300');

  confirm_back.classList.remove('opacity-100');
  confirm_back.classList.add('opacity-0');

  confirm_back.classList.remove('ease-in', 'duration-200');
  confirm_back.classList.add('ease-out', 'duration-300');

  user_dialog.classList.remove('visible');
  user_dialog.classList.add('invisible');
}

// display the modify message
function displayModify() {
  const modify = document.getElementById('modify');
  const validate = document.getElementById('validateUser');
  modify.classList.remove('hidden');
  validate.classList.add('hidden');
}

// hide the modify message
function hideModify() {
  const modify = document.getElementById('modify');
  const validate = document.getElementById('validateUser');
  modify.classList.add('hidden');
  validate.classList.remove('hidden');
}

// validate the info
async function validateCurr(username, password, type, status, id) {
  // call the endpoint
  let data = await validateInfo(username, password, type, id);

  // display the message
  const validation = document.getElementById('validateError');
  validation.textContent = data;
  if (data === 'validtion successful') {
    displayModify();
  }
}

// modify the user
async function modifyCurr(username, password, type, status, id) {
  // call the endpoint
  let data = await modifyInfo(username, password, type, status, id);
  console.log('data:', data);
  if (data === 'modify successful') {
    // close the dialog
    close_edit_dialog();
  }
}
