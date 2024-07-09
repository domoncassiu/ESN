import { initializeSocket } from './endpoints.js';

document.addEventListener('DOMContentLoaded', async function () {
  const myButton = document.getElementById('menu-button');

  myButton.addEventListener('click', function () {
    status();
  });

  var curr_status = await getStatus();
  console.log(curr_status);

  var button1 = document.getElementById('safe');
  var button2 = document.getElementById('help');
  var button3 = document.getElementById('emergency');

  if (curr_status === 'OK') {
    button1.classList.add('bg-gray-100');
    button2.classList.remove('bg-gray-100');
    button3.classList.remove('bg-gray-100');
  } else if (curr_status === 'Help') {
    button1.classList.remove('bg-gray-100');
    button2.classList.add('bg-gray-100');
    button3.classList.remove('bg-gray-100');
  } else if (curr_status === 'Emergency') {
    button1.classList.remove('bg-gray-100');
    button2.classList.remove('bg-gray-100');
    button3.classList.add('bg-gray-100');
  }

  button1.addEventListener('click', async function () {
    var status_block = document.getElementById('status_block');
    status_block.classList.remove('opacity-100', 'scale-100');
    status_block.classList.add('opacity-0', 'scale-95');
    button1.classList.add('bg-gray-100');
    button2.classList.remove('bg-gray-100');
    button3.classList.remove('bg-gray-100');
    await updateStatus('OK');
  });

  button2.addEventListener('click', async function () {
    var status_block = document.getElementById('status_block');
    status_block.classList.remove('opacity-100', 'scale-100');
    status_block.classList.add('opacity-0', 'scale-95');
    button1.classList.remove('bg-gray-100');
    button2.classList.add('bg-gray-100');
    button3.classList.remove('bg-gray-100');
    await updateStatus('Help');
  });

  button3.addEventListener('click', async function () {
    var status_block = document.getElementById('status_block');
    status_block.classList.remove('opacity-100', 'scale-100');
    status_block.classList.add('opacity-0', 'scale-95');
    button1.classList.remove('bg-gray-100');
    button2.classList.remove('bg-gray-100');
    button3.classList.add('bg-gray-100');
    await updateStatus('Emergency');
  });

  // handle socket io
  const socket = await initializeSocket();

  socket.on('safety status', async (status) => {
    // update html;
    var username = status.username;
    var userdiv = document.getElementById(username);
    var img = userdiv.children[0];
    if (status.safetyStatus === 'OK') {
      img.src = '../images/safe.svg';
    } else if (status.safetyStatus === 'Help') {
      img.src = '../images/help.svg';
    } else if (status.safetyStatus === 'Emergency') {
      img.src = '../images/emergency.svg';
    }
    console.log(status);
  });
});

function status() {
  console.log('status button clicked');
  var status_block = document.getElementById('status_block');
  if (status_block.classList.contains('opacity-0')) {
    console.log('status block is hidden');
    status_block.classList.remove('opacity-0', 'scale-95');
    status_block.classList.add('opacity-100', 'scale-100');
  } else {
    status_block.classList.remove('opacity-100', 'scale-100');
    status_block.classList.add('opacity-0', 'scale-95');
  }
}

// update status endpoint
async function updateStatus(status) {
  const response = await fetch('/users/status', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (response.status === 204) {
    console.log('update successful:', data);
    return data;
  } else {
    console.error('update failed:', data);
    return null;
  }
}

// get status endpoint
async function getStatus() {
  const response = await fetch('/users/status', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (response.status === 200) {
    console.log('get successful:', data);
    return data;
  } else {
    console.error('get failed:', data);
    return null;
  }
}
