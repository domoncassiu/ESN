function closeDialog() {
  const dialog = document.getElementById('search-dialog');
  dialog.classList.add('hidden');
}
function openDialog(itemId) {
  // 显示模态窗口
  const dialog = document.getElementById('search-dialog');
  dialog.classList.remove('hidden');
  fetch(`/resource/${itemId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then(async (res) => {
    const responseData = await res.json();
    let { location, user, additionalInfo, resourceHelps } = responseData[0];
    // 根据itemId更新模态窗口内容
    const modalContent = document.getElementById('modalContent');
    const lightColors = ['#fecaca', '#bfdbfe', '#bbf7d0', '#fefcbf', '#e9d5ff'];
    const colorClass = (modalContent.innerHTML = `
            <div class="space-y-10 font-7">
                <p>address：${location}<p>
                <p>user：${user}<p>
                <p>additionalInfo：${additionalInfo}<p>
                <div class="flex flex-col space-y-4" style="display: ${resourceHelps && resourceHelps.length > 0 ? 'block' : 'none'}" >
                      ${
                        resourceHelps &&
                        resourceHelps
                          .map(
                            (item, index) => `<div
                        style="font-size: 1.5vh;padding: 34px 10px;"  class="border-2 rounded-xl space-y-4">
                       <p>helper: ${item.helper}</p>
                       <p style="word-break: break-all">address: ${item.address}</p>
                       <p>quantity: ${item.quantityOffered}</p>
                    </div>`,
                          )
                          .join('')
                      }
                </div>
                
                  </div>
            </div>
        `);
    document.querySelector('#ww-dialog-button').onclick = closeDialog;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  function getQueryParam(param) {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
  }

  function createModalStructure(content) {
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
    <div id="search-dialog" class="relative z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="ease-in duration-200 opacity-100 fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="ease-in duration-200 opacity-100 translate-y-0 sm:scale-100 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8  sm:max-w-7xl sm:p-6">
            <h3 class="mt-4 text-5xl font-semibold leading-10 text-gray-900 " id="modal-title">
                  Details
                </h3>
            <!-- 内容将在这里更新 -->
           <div id="modalContent" style="width: 90vw" class="text-5xl mt-10"></div>
           <div id="paging" class="hidden text-5xl text-center">
                   
            </div>
           <div class="flex justify-end">
            <button id="ww-dialog-button" onclick="closeDialog" type="button" class="inline-flex w-full mt-8 justify-center rounded-md bg-red-300 px-6 py-4 text-4xl font-semibold text-white shadow-sm hover:bg-red-200 sm:ml-3 sm:w-auto">
                I got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modalContainer);
  }

  createModalStructure();

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString(); // 使用本地时间和格式
  }
  function renderList(data, containerId) {
    let container = document.getElementById(containerId);
    container.innerHTML = ''; // 清除现有内容
    let cardHTML = '';
    //  <div class="flex justify-between px-4 " style="font-size: 1.8vh">
    //                     <span>${item.additionalInfo || 'additionalInfo'}</span>
    //                 </div>
    if (containerId === 'Me') {
      data.forEach((item) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'border mt-10 py-6 border-2 rounded-xl';
        // 构建卡片HTML，动态插入数据
        cardElement.innerHTML = `
                <div class="flex justify-between px-4 py-4 items-center" style="font-size: 1.8vh">
                    <div class="flex flex-col">
                        <span>${item.additionalInfo || 'additionalInfo'}</span>
                    </div>
                    <div class="mr-6">
                        <img   onclick="window.location.href='./resources_page_del_confirm.html?resource=' + '${item._id}'" src="../images/delete-recycle-bin-trash-can-svgrepo-com.svg"  width="56"/>
                    </div>
                </div>
                <div class="border-t-2 flex justify-between pt-8 px-4 items-center">
                    <button
                        style="font-size: 2vh;display: inline-block;width: auto;height: auto;background-color: #9feb9f"
                        type="button"
                        class="self-center items-center gap-x-2 px-8 rounded-[0.6vh] bg-red-300 px-3.5 py-2.5 text-5xl font-semibold text-white shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                    >
                        ${item.name || 'resources'}
                    </button>
                    <div class="font-resource-xs px-4" style="margin-top: 0.4vh;font-size: 1.8vh">
                    ${formatDateTime(item.createdAt) || 'Additional Information Not Available'}
                </div>
                </div>
        `;
        container.appendChild(cardElement);
        cardElement.addEventListener('click', () => openDialog(item._id));
      });
    } else if (containerId === 'Public') {
      data.forEach((item) => {
        // 创建卡片元素的容器
        const cardElement = document.createElement('div');
        cardElement.className = 'border mt-10 py-6 border-2 rounded-xl';
        // 构建卡片HTML，动态插入数据
        cardElement.innerHTML = `
                <div class="flex justify-between px-4 py-4">
                    <span>${item.user || 'Name Not Provided'}</span>
                    <button
                        style="font-size: 2vh;display: inline-block;width: auto;height: auto;background-color: #9feb9f"
                        type="button"
                        class="self-center items-center gap-x-2 px-8 rounded-[0.6vh] bg-red-300 px-3.5 py-2.5 text-5xl font-semibold text-white shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                    >
                        ${item.name || 'User Info'}
                    </button>
                </div>
                   <div class="px-4 mb-4" style="font-size: 1.4vh">
                    <span>${item.additionalInfo || 'Location Not Provided'}</span>
                   </div>
                <div class="border-t-2 flex justify-between pt-8 px-4">
                 <div class="font-resource-xs px-4 " style="margin-top: 0.4vh;font-size: 1.8vh">
                    ${formatDateTime(item.createdAt) || 'Additional Information Not Available'}
                </div>
                    <button
                        style="width: 20vw;height: 3vh;font-size: 1.6vh"
                        type="button"
                         onclick="window.location.href='./resources_page_add_help.html?resource=' + '${item._id}'"
                        class=" self-center items-center gap-x-2 rounded-[0.6vh] bg-red-300 px-3.5 py-2.5 text-5xl font-semibold text-white shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                    >
                        Help
                    </button>
                </div>
        `;
        container.appendChild(cardElement);
        cardElement.addEventListener('click', () => openDialog(item._id));
      });
    }
    container.insertAdjacentHTML('beforeend', cardHTML);
  }

  async function fetchAndRenderContent(resourceName) {
    let url = '/resource';
    if (resourceName === 'Me') {
      url += `?userId=ok`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    renderList(responseData, resourceName);
  }

  function openResource(evt, resourceName, active) {
    let needHelp = document.querySelector('#needHelp');
    if (resourceName === 'Me') {
      needHelp.classList.remove('hidden');
    } else {
      needHelp.classList.add('hidden');
    }

    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    let formattedResourceName = resourceName.replace(/\s/g, '');

    document.getElementById(formattedResourceName).style.display = 'block';
    if (evt) {
      evt.currentTarget.className += ' active';
    } else {
      tablinks[active].className += ' active';
    }
    fetchAndRenderContent(formattedResourceName);
  }

  let tablinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener('click', function (event) {
      let resourceName = this.textContent;

      if (resourceName === 'Public') {
        const url = new URL(window.location);
        url.searchParams.set('isMe', 'no');
        window.history.pushState({ path: url.href }, '', url.href);
      } else {
        const url = new URL(window.location);
        url.searchParams.set('isMe', 'ok');
        window.history.pushState({ path: url.href }, '', url.href);
      }

      openResource(event, resourceName);
    });
  }

  if (getQueryParam('isMe') === 'ok') {
    console.log(123);
    openResource(null, 'Me', 1);
  } else {
    console.log(12);
    openResource(null, 'Public', 0);
  }

  // establish socket connection
  let ENDPOINT;
  if (window.location.hostname === 'localhost') {
    ENDPOINT = 'http://localhost:3000';
  } else {
    ENDPOINT = 'https://s24esnb5.onrender.com';
  }
  console.log('private endpoint set: ', ENDPOINT);
  const socket = io(ENDPOINT, {
    origin: window.location.hostname,
    auth: {
      token: localStorage.getItem('token'),
    },
    transports: ['websocket'],
  });
  socket.on('new resource request', (err) => {
    if (getQueryParam('isMe') === 'ok') {
      console.log(123);
      openResource(null, 'Me', 1);
    } else {
      console.log(12);
      openResource(null, 'Public', 0);
    }
  });
});
