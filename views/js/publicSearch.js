import * as search from './search.js';
import { updateMessage } from './utils.js';

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
async function getMessages_mess(search = '', page = initPage) {
  const queryParams = `?page=${page}&keyword=${search}`;

  try {
    const response = await fetch(`/search/public${queryParams}`, {
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
      console.error('Failed to fetch public messages:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
function createMessageContainer() {
  const divElement = document.createElement('div');

  divElement.classList.add('flex-1', 'overflow-auto', 'space-y-10');
  divElement.setAttribute('id', 'messageContainer');
  return divElement;
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

      initial.forEach((message) => {
        const messageElement = updateMessage(message);
        container.appendChild(messageElement);
        messageElement.scrollIntoView(false);
      });

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
