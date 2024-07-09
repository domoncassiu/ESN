import { postMessage, getMessage } from './endpoints.js';
import { render_edit_dialog } from './admin_list_page.js';

export function setupDialog() {
  const modal1_next = document.getElementById('modal1_next');
  const modal1_panel = document.getElementById('modal1_panel');

  const dialog1 = document.getElementById('dialog1');
  const dialog2 = document.getElementById('dialog2');
  const dialog3 = document.getElementById('dialog3');

  const modal2_back = document.getElementById('modal2_back');
  const modal2_next = document.getElementById('modal2_next');
  const modal2_panel = document.getElementById('modal2_panel');

  const modal3_back = document.getElementById('modal3_back');
  const modal3_next = document.getElementById('modal3_next');
  const modal3_panel = document.getElementById('modal3_panel');

  modal1_next.addEventListener('click', function () {
    modal1_panel.classList.remove(
      'opacity-100',
      'translate-y-0',
      'sm:scale-100',
    );
    modal1_panel.classList.add(
      'opacity-0',
      'translate-y-4',
      'sm:translate-y-0',
      'sm:scale-95',
    );

    modal2_panel.classList.remove(
      'opacity-0',
      'translate-y-4',
      'sm:translate-y-0',
      'sm:scale-95',
    );
    modal2_panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
    modal2_panel.classList.remove('ease-out', 'duration-300');
    modal2_panel.classList.add('ease-in', 'duration-200');

    dialog1.style.display = 'none';
  });

  modal2_next.addEventListener('click', function () {
    modal2_back.classList.remove('opacity-100');
    modal2_back.classList.add('opacity-0');
    modal2_panel.classList.remove(
      'opacity-100',
      'translate-y-0',
      'sm:scale-100',
    );
    modal2_panel.classList.add(
      'opacity-0',
      'translate-y-4',
      'sm:translate-y-0',
      'sm:scale-95',
    );

    modal3_panel.classList.remove(
      'opacity-0',
      'translate-y-4',
      'sm:translate-y-0',
      'sm:scale-95',
    );
    modal3_panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
    modal3_panel.classList.remove('ease-out', 'duration-300');
    modal3_panel.classList.add('ease-in', 'duration-200');

    dialog2.style.display = 'none';
  });

  modal3_next.addEventListener('click', function () {
    modal3_back.classList.remove('opacity-100');
    modal3_back.classList.add('opacity-0');
    modal3_panel.classList.remove(
      'opacity-100',
      'translate-y-0',
      'sm:scale-100',
    );
    modal3_panel.classList.add(
      'opacity-0',
      'translate-y-4',
      'sm:translate-y-0',
      'sm:scale-95',
    );
    dialog3.style.zIndex = '-1';
  });
}

export function setupMessageContainer(
  initial,
  chat = 'publicchat',
  isModerator = false,
) {
  // update html to display messages
  if (initial) {
    // get the html by id
    const messagesContainer = document.getElementById('messageContainer');
    initial.forEach((message) => {
      // call the update function
      const messageElement = updateMessage(message, isModerator);
      messagesContainer.appendChild(messageElement);
      messageElement.scrollIntoView(false);
    });
  }

  // hide the footer when input is sleceted
  const input = document.getElementById(chat);
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
}

function getColor(sentiment) {
  let red = sentiment.score < 0 ? 255 * (sentiment.score * -1.0) : 0.0;
  // let blue = 0.0;
  let blue = sentiment.score > 0 ? 255 * sentiment.score * 0.5 : 0.0;
  let green = sentiment.score > 0 ? 255 * sentiment.score : 0.0;
  return `background-color: rgba(${red}, ${green}, ${blue}, ${sentiment.magnitude * 0.7});`;
}

// add message block
export function updateMessage(message, isModerator = false) {
  console.log('isModerator: ', isModerator);
  const date = new Date(message.timestamp);
  const messageContainer = document.createElement('message-element');
  messageContainer.setAttribute('username', message.username);
  messageContainer.setAttribute('userId', message.senderId);
  messageContainer.setAttribute(
    'safetyStatus',
    message.safetyStatus === 'OK' ? 'safe' : message.safetyStatus,
  );
  messageContainer.setAttribute(
    'isModerator',
    isModerator === true ? 'true' : 'false',
  );
  messageContainer.setAttribute('timestamp', date.toLocaleString());
  messageContainer.setAttribute('messageId', message.messageId);
  messageContainer.setAttribute('message', message.message);

  if (isModerator) {
    messageContainer.setAttribute('incidentId', message.incidentId);
  }
  if (message.sentiment !== null && message.sentiment !== undefined) {
    messageContainer.setAttribute('color', getColor(message.sentiment));
  }

  return messageContainer;
}

// close popup
export function read() {
  const confirm_panel = document.getElementById('confirm_panel');
  const dialog = document.getElementById('confirm_dialog');

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
export function showPopup(username) {
  const confirm_panel = document.getElementById('confirm_panel');
  const dialog = document.getElementById('confirm_dialog');
  const text = document.getElementById('notification_text');

  text.innerHTML = `${username} just sent you a message!`;

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

export function renderUser(user, type = 'chat') {
  const userDiv = document.createElement('div');
  userDiv.className = 'message-container flex items-center';
  userDiv.id = user.username;

  userDiv.onclick = () => {
    if (type === 'chat') {
      localStorage.setItem('username', user.username);
      localStorage.setItem('userId', user.userId);
      location.href = './private_chat_page.html';
    } else {
      render_edit_dialog(user.username);
    }
  };

  if (user.safetyStatus == 'Help') {
    const img = document.createElement('img');
    img.src = '../images/help.svg';
    userDiv.appendChild(img);
    img.classList.add('top-icon', 'fill-main');
  } else if (user.safetyStatus == 'OK') {
    const img = document.createElement('img');
    img.src = '../images/safe.svg';
    userDiv.appendChild(img);
    img.classList.add('top-icon', 'fill-main');
  } else if (user.safetyStatus == 'Emergency') {
    const img = document.createElement('img');
    img.src = '../images/emergency.svg';
    userDiv.appendChild(img);
    img.classList.add('top-icon', 'fill-main');
  } else if (user.safetyStatus == 'Undefined') {
    const img = document.createElement('img');
    img.src = '../images/undefined.svg';
    userDiv.appendChild(img);
    img.classList.add('top-icon', 'fill-main');
  }

  return userDiv;
}
