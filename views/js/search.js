let initPage = 1;

function createModalStructure(content) {
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = `
    <div id="search-dialog" class="relative z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="ease-in duration-200 opacity-100 fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="ease-in duration-200 opacity-100 translate-y-0 sm:scale-100 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8  sm:max-w-7xl sm:p-6">
            <h3 class="mt-4 text-5xl font-semibold leading-10 text-gray-900 " id="modal-title">
                  Search result
                </h3>
            <!-- 内容将在这里更新 -->
           <div id="modalContent" style="width: 90vw" class="text-5xl mt-10"></div>
           <div id="paging" class="hidden text-5xl text-center">
                   
            </div>
           <div class="flex justify-end">
            <button id="search-dialog-button" type="button" class="inline-flex w-full mt-8 justify-center rounded-md bg-red-300 px-6 py-4 text-4xl font-semibold text-white shadow-sm hover:bg-red-200 sm:ml-3 sm:w-auto">
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modalContainer);
}

createModalStructure();

export function openDialog() {
  const dialog = document.getElementById('search-dialog');
  dialog.classList.remove('hidden');
}

export function settingData(content) {
  const modalContent = document.getElementById('modalContent');

  if (typeof content === 'string') {
    modalContent.innerHTML = content;
  } else if (content instanceof Element) {
    modalContent.innerHTML = '';

    modalContent.append(content);
  }
}

export function showPaging(fun) {
  document.querySelector('#paging').classList.remove('hidden');
  document.querySelector('#paging').innerHTML = 'load more';
  document.querySelector('#paging').onclick = fun;
}
export function hiddenPaging() {
  document.querySelector('#paging').classList.remove('hidden');
  document.querySelector('#paging').innerHTML = 'no more data ...';
  document.querySelector('#paging').onclick = '';
}
export function hiddenPagingOK() {
  document.querySelector('#paging').classList.add('hidden');
  // document.querySelector('#paging').innerHTML = 'no more data ...';
  // document.querySelector('#paging').onclick = '';
}

export function hideModal() {
  const dialog = document.getElementById('search-dialog');
  dialog.classList.add('hidden');
  initPage = 1;
}

// create div element
const container = document.createElement('div');
container.className = 'container-search';

// create input element
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Search...';
input.id = 'search_input';

// create div element for search icon
const searchDiv = document.createElement('div');
searchDiv.className = 'search';

// place search icon inside search div
container.appendChild(input);
container.appendChild(searchDiv);
console.log(container);
// add container to the body
document.body.appendChild(container);

document.querySelector('#search-dialog-button').onclick = () => {
  hideModal();
};
