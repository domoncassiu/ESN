// ---- run on every refresh ----
import {
  getAnnounce,
  initializeSocket,
  postAnnounce,
  subscribeToPrivateAndTesting,
} from './endpoints.js';
import { read, showPopup } from './utils.js';

const toPrivate = () => {};

// on page load
document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');
  const tokenParts = token.split('.');

  // The payload is the second part
  const payload = JSON.parse(atob(tokenParts[1]));
  let publicchat = document.querySelector('#publicchat');

  console.log("payload['type']", payload['type']);
  if (payload['type'] === 'Citizen') {
    publicchat.style.display = 'none';
  }

  const myButton = document.getElementById('confirm');

  myButton.addEventListener('click', function () {
    read();
  });

  // establish socket connection
  let socket = await initializeSocket();
  socket = await subscribeToPrivateAndTesting(socket);

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
      // // get all the messages
      const initial = await getAnnounce();
      console.log(initial);

      // update html to display messages
      if (initial) {
        // get the html by id
        const messagesContainer = document.getElementById('messageContainer');
        initial.forEach((message) => {
          // call the update function
          const messageElement = updateMessage(message);
          messagesContainer.appendChild(messageElement);
          messageElement.scrollIntoView(false);
        });
      }
    } else {
      localStorage.setItem('token', msg.newToken);
    }
  });

  socket.on('announcement', (msg) => {
    console.log('announcement received:', msg);
    // update html
    const messagesContainer = document.getElementById('messageContainer');
    const messageElement = updateMessage(msg);
    messagesContainer.appendChild(messageElement);
    // scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  // // get all the messages
  const initial = await getAnnounce();
  console.log(initial);

  // update html to display messages
  if (initial) {
    // get the html by id
    const messagesContainer = document.getElementById('messageContainer');
    initial.forEach((message) => {
      // call the update function
      const messageElement = updateMessage(message);
      messagesContainer.appendChild(messageElement);
      messageElement.scrollIntoView(false);
    });
  }

  // hide the footer when input is sleceted
  const input = document.getElementById('publicchat');
  const footer = document.getElementById('footernav');
  const inputbar = document.getElementById('inputbar');

  input.addEventListener('focus', function () {
    footer.classList.add('hidden');
    inputbar.classList.remove('bottom-[8vh]');
    inputbar.classList.add('bottom-[0.5vh]');
  });

  input.addEventListener('blur', function () {
    footer.classList.remove('hidden');
    inputbar.classList.remove('bottom-[0.5vh]');
    inputbar.classList.add('bottom-[8vh]');
  });

  // send message when return is pressed
  input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      clickSend();
    }
  });
});

// ---- helper functions ----
// add message block
export function updateMessage(message) {
  // <div class="flex flex-col gap-2.5 w-full leading-1.5 p-4 border-gray-200 bg-red-100 rounded-e-3xl rounded-es-3xl mb-7">
  //     <div class="text-4xl flex items-center space-x-2 rtl:space-x-reverse">
  //     <span class="font-bold-300 text-gray-500 dark:text-gray-400">Bonnie Green</span>
  //     <span class="font-bold-300 text-gray-500 dark:text-gray-400">11:46</span>
  //     </div>
  //     <p class="font-7 text-black font-normal break_all">tisis20characterlong</p>
  // </div>
  const messageContainer = document.createElement('div');
  messageContainer.classList.add(
    'p-7',
    'flex',
    'flex-col',
    'gap-2.5',
    'w-full',
    'leading-1.5',
    'p-4',
    'border-gray-200',
    'bg-red-100',
    'rounded-e-3xl',
    'rounded-es-3xl',
    'mb-7',
  );

  const messageInfo = document.createElement('div');
  messageInfo.classList.add(
    'text-4xl',
    'flex',
    'items-center',
    'space-x-2',
    'rtl:space-x-reverse',
    'justify-between',
  );

  const date = new Date(message.timestamp);

  const senderParagraph = document.createElement('span');
  senderParagraph.classList.add(
    'font-bold-300',
    'text-gray-500',
    'dark:text-gray-400',
  );
  senderParagraph.textContent = message.sender;

  const senderParagraph2 = document.createElement('span');
  senderParagraph2.classList.add(
    'font-bold-300',
    'text-gray-500',
    'dark:text-gray-400',
  );
  senderParagraph2.textContent = date.toLocaleString();

  const messageParagraph = document.createElement('p');
  messageParagraph.classList.add(
    'font-7',
    'text-black',
    'font-bold-300',
    'break_all',
  );
  messageParagraph.textContent = message.message;

  messageInfo.appendChild(senderParagraph);
  messageInfo.appendChild(senderParagraph2);

  messageContainer.appendChild(messageInfo);
  messageContainer.appendChild(messageParagraph);

  return messageContainer;
}

// ---- onclick functions ----

// handle the send message button click event
async function clickSend() {
  const textbox = document.getElementById('publicchat');
  const message = textbox.value;
  console.log(message);

  if (message == '') {
    textbox.placeholder = 'Please enter your message';
  } else {
    // post the message
    const new_message = await postAnnounce(message);
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
