class Header_component extends HTMLElement {
  static observedAttributes = ['selectedPage'];
  constructor() {
    super();
  }

  connectedCallback() {
    let page = this.getAttribute('selectedPage');
    this.innerHTML = `
    <div class="toptitile z-20">
      <svg class="topicon" viewBox="0 0 50 50">
        <g transform="translate(10, 10)">
          <!--        <path transform="translate(-50 -50)" fill="tomato" d="M18 3C11.3726 3 6 8.37258 6 15C6 23.544 12.12 29.8361 17.25 36.6528C17.6406 37.1742 18.3594 37.1742 18.75 36.6528C23.88 29.8361 30 23.544 30 15C30 8.37258 24.6274 3 18 3Z"></path>-->
          <path
            d="M5.477,13.592l3.699-4.625c0.215-0.267,0.556-0.402,0.89-0.369c0.34,0.037,0.638,0.245,0.788,0.552l4.191,8.501l5.098-7.14
            c0.185-0.26,0.482-0.415,0.802-0.419c0.295-0.007,0.621,0.146,0.812,0.4l2.7,3.6h4.695c0.039-0.112,0.09-0.218,0.127-0.331
            c1.491-5.369,0.203-8.604-1.141-10.371C26.526,1.268,23.887,0,21.079,0c-2.39,0-4.631,1.013-6.103,2.673
            C13.5,1.013,11.247,0,8.844,0C6.042,0,3.406,1.265,1.797,3.383C0.472,5.127-0.792,8.302,0.62,13.592H5.477z"
          />
          <path
            d="M23.957,16.092c-0.314,0-0.611-0.148-0.8-0.4l-2.181-2.906l-5.275,7.388c-0.188,0.265-0.492,0.419-0.813,0.419
            c-0.026,0-0.054-0.001-0.081-0.003c-0.351-0.029-0.66-0.239-0.815-0.555l-4.235-8.59l-3.018,3.772
            c-0.19,0.237-0.478,0.375-0.781,0.375H1.375c3.755,8.193,13.583,12.872,13.583,12.997v0.003c0.007,0,0.016,0,0.02,0v-0.001
            c0.871-0.075,9.573-4.864,13.331-12.499H23.957z"
          />
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1; 1.25; 1.25; 1.25; 1.25; 1;"
            dur="1s"
            repeatCount="indefinite"
            additive="sum"
          ></animateTransform>
        </g>
      </svg>
      <p style="${page === 'Directory' ? 'display: none;' : ''}">ESN</p>
    </div>

    <div class="button_holder z-20">
      <button
        id="admin_button"
        type="button"
        onclick="window.location.href='./admin_list_page.html';"
        class="mr-4 front_page_button self-center items-center gap-x-1.5 rounded-[0.6vh] bg-white px-3.5 py-2.5 text-4xl font-normal text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        style="${page === 'Directory' ? '' : 'display: none;'}"
      >
        admin
      </button>

      <button
        id="test_button"
        type="button"
        onclick="window.location.href='./esn_test_page.html';"
        class="mr-4 front_page_button self-center items-center gap-x-1.5 rounded-[0.6vh] bg-white px-3.5 py-2.5 text-4xl font-normal text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        style="${page === 'Directory' ? '' : 'display: none;'}"
      >
        test
      </button>
       
      <div class="relative inline-block text-left" style="${page === 'Directory' || page === 'Private' ? '' : 'display: none;'}">
        <div>
          <!-- front_page_button self-center items-center gap-x-2 rounded-[0.6vh] bg-red-300 px-3.5 py-2.5 text-4xl font-semibold text-white shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 -->
          <button
            type="button"
            class="status_button w-full justify-center gap-x-1.5 rounded-[0.6vh] bg-white px-3.5 py-2.5 text-4xl font-normal text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            status
            <!-- <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg> -->
          </button>
        </div>

        <div
          id="status_block"
          class="transition ease-out transform opacity-0 scale-95 duration-100 absolute left-4 z-10 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div class="py-1" role="none">
            <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
            <a
              href="#"
              class="text-gray-700 group flex items-center px-7 py-0 text-4xl bg-gray-100"
              role="menuitem"
              tabindex="-1"
              id="safe"
            >
              <img src="../images/safe.svg" class="top-icon fill-main" />
              Safe
            </a>
            <a
              href="#"
              class="text-gray-700 group flex items-center px-7 py-0 text-4xl"
              role="menuitem"
              tabindex="-1"
              id="help"
            >
              <img src="../images/help.svg" class="top-icon fill-main" />
              Help
            </a>
            <a
              href="#"
              class="text-gray-700 group flex items-center px-7 py-0 text-4xl"
              role="menuitem"
              tabindex="-1"
              id="emergency"
            >
              <img src="../images/emergency.svg" class="top-icon fill-main" />
              Emergency
            </a>
          </div>
        </div>
      </div>

      <!-- logout button -->

      <button
        id="logout_button"
        type="button"
        class="front_page_button self-center items-center gap-x-2 rounded-[0.6vh] bg-red-300 px-3.5 py-2.5 text-5xl font-semibold text-white shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300" 
        style="${page === 'Register' ? 'display: none;' : ''}"
      >
        logout
      </button>
      
      <div class="button_holder2 z-20">
     
    </div>
        `;
  }
}

customElements.define('header-component', Header_component);
