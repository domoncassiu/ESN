import * as search from './search.js';

let initPage = 1;

document.addEventListener('DOMContentLoaded', async function () {
  const input = document.getElementById('search_input');
  input.addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
      initPage = 1;
      publicSearch(
        input.value,
        search.hideModal,
        search.openDialog,
        search.settingData,
      );
      input.value = '';
      input.blur();
    }
  });
});

let is_name_page = '';
async function getMessages_mess(search = '', page = initPage) {
  const searchLowerCase = search.toLowerCase();

  let apiUrl;
  if (['ok', 'emergency', 'help'].includes(searchLowerCase)) {
    if (searchLowerCase === 'ok') {
      search = 'OK';
    }
    if (searchLowerCase === 'emergency') {
      search = 'Emergency';
    }
    if (searchLowerCase === 'help') {
      search = 'Help';
    }
    apiUrl = `/search/statuses?page=${page}&keyword=${search}`;
    is_name_page = '';
  } else {
    is_name_page = 'yes';
    apiUrl = `/search/citizens?page=${page}&keyword=${search}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error('获取信息失败:', data.message);
      return null;
    }
  } catch (error) {
    console.log(error);
    console.error('错误:', error);
  }
}

function createMessageContainer() {
  const divElement = document.createElement('div');
  divElement.classList.add('flex-1', 'overflow-auto', 'space-y-10');
  divElement.setAttribute('id', 'messageContainer');
  return divElement;
}
// function createUserListElement(userlist) {
//   const userListContainer = document.createElement('div');
//   userListContainer.className = 'user-list-container';
//
//   userlist.forEach((user) => {
//     const userDiv = document.createElement('div');
//     userDiv.className = 'user-container flex items-center';
//     userDiv.id = user.username;
//
//     const img = document.createElement('img');
//     img.classList.add('top-icon', 'fill-main');
//     switch (user.safetyStatus) {
//       case 'Help':
//         img.src = '../images/help.svg';
//         break;
//       case 'OK':
//         img.src = '../images/safe.svg';
//         break;
//       case 'Emergency':
//         img.src = '../images/emergency.svg';
//         break;
//       case 'Undefined':
//         img.src = '../images/undefined.svg';
//         break;
//     }
//     userDiv.appendChild(img);
//
//     const usernameParagraph = document.createElement('p');
//     usernameParagraph.className = 'username ml-1 font-8';
//     usernameParagraph.textContent = user.username;
//     userDiv.appendChild(usernameParagraph);
//
//     userListContainer.appendChild(userDiv);
//   });
//
//   return userListContainer;
// }

function createUserListElement(userlist) {
  // Create containers for online and offline users
  const onlineContainer = document.createElement('div');
  onlineContainer.id = 'Online';
  const offlineContainer = document.createElement('div');
  offlineContainer.id = 'Offline';

  // Create and add headers for Online and Offline users
  const onlineHeader = document.createElement('h2');
  onlineHeader.textContent = 'Online Users';
  onlineHeader.className = 'online-header';
  onlineContainer.appendChild(onlineHeader);

  const offlineHeader = document.createElement('h2');
  offlineHeader.textContent = 'Offline Users';
  offlineHeader.className = 'offline-header text-iconFont';
  offlineContainer.appendChild(offlineHeader);

  // Sort the userlist by username
  userlist.sort((a, b) => a.username.localeCompare(b.username));

  userlist.forEach((user) => {
    const userDiv = document.createElement('div');
    userDiv.className = 'message-container flex items-center justify-between'; // Updated to space items and arrow
    userDiv.id = user.username;

    // Setting click event listener
    userDiv.onclick = () => {
      localStorage.setItem('username', user.username);
      location.href = './private_chat_page.html';
    };

    // Adding status icon based on safetyStatus
    const img = document.createElement('img');
    img.classList.add('top-icon', 'fill-main');
    switch (user.safetyStatus) {
      case 'Help':
        img.src = '../images/help.svg';
        break;
      case 'OK':
        img.src = '../images/safe.svg';
        break;
      case 'Emergency':
        img.src = '../images/emergency.svg';
        break;
      case 'Undefined':
        img.src = '../images/undefined.svg';
        break;
    }
    userDiv.appendChild(img);

    // Adding username paragraph
    const paragraph = document.createElement('p');
    paragraph.classList.add('font-8', 'ml-1');
    if (user.onlineStatus !== 'Online') {
      paragraph.classList.add('text-iconFont');
    }
    paragraph.textContent = user.username;
    userDiv.appendChild(paragraph);

    // Append userDiv to the corresponding container based on online status
    if (user.onlineStatus === 'Online') {
      onlineContainer.appendChild(userDiv);
    } else {
      offlineContainer.appendChild(userDiv);
    }
  });

  // Return both containers as an object for further use
  return { onlineContainer, offlineContainer };
}

function fetchAndDisplayMessages(keyword, settingData, container) {
  getMessages_mess(keyword, initPage)
    .then((initial) => {
      if (initial.length <= 0) {
        settingData(`<div class="text-4xl">No data available...</div>`);
        search.hiddenPaging();
        return;
      }

      if (initial.length < 10) {
        search.hiddenPaging();
      } else {
        search.showPaging(() => {
          initPage += 1;
          container.innerHTML = '';
          fetchAndDisplayMessages(keyword, settingData, container);
        });
      }

      if (is_name_page === 'yes') {
        // hiddenPagingOK()
      }
      // 实时隐藏
      search.hiddenPagingOK();

      const { onlineContainer, offlineContainer } =
        createUserListElement(initial);
      container.appendChild(onlineContainer);
      container.appendChild(offlineContainer);
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
      //
      // initial.forEach((message) => {
      //
      // });

      settingData(container);
    })
    .catch((err) => {
      console.log(err);
      settingData(
        `<div class="text-4xl" style="color: red">loading error!</div>`,
      );
    });
}

function publicSearch(keyword, hideModal, openDialog, settingData) {
  openDialog();
  settingData(`<div class="text-4xl">Loading ...</div>`);
  let container = createMessageContainer();
  fetchAndDisplayMessages(keyword, settingData, container);
}
