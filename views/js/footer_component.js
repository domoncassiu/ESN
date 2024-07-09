class Footer_component extends HTMLElement {
  static observedAttributes = ['selectedPage'];
  constructor() {
    super();
  }

  connectedCallback() {
    let unselected_color = '#CCCCCC';
    let selected_color = '#FFA3A3';
    let unselected_font = 'text-iconFont';
    let selected_font = 'text-main';
    let page = this.getAttribute('selectedPage');
    this.innerHTML = `
      <footer id="footernav" class="fixed bottom-1 w-full bg-white">
      <div class="flex justify-around border-t border-hui pt-8">
        <div
          class="flex flex-col items-center"
          id="toggleButton1"
        >
         
          <svg version="1.1"   class="top-icon-3 fill-main" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
\t width="31px" height="24.389px" viewBox="0 0 31 24.389" style="enable-background:new 0 0 31 24.389;" xml:space="preserve">
<g id="message-3">
\t<path fill="${page === 'Public' || page === 'Private' ? selected_color : unselected_color}" d="M26.242,0H4.922C2.314,0,0,2.106,0,4.712v10.659C0,17.978,2.313,20,4.922,20h10.505l-1.137,3.619
\t\tc-0.099,0.619,0.526,0.924,1.073,0.69l9.242-4.311h1.637c2.605,0,4.758-2.021,4.758-4.629V4.711C31,2.107,28.85,0,26.242,0z M22,13
\t\tH8c-0.553,0-1-0.447-1-1c0-0.554,0.447-1,1-1h14c0.553,0,1,0.446,1,1C23,12.553,22.553,13,22,13z M22,9H8C7.447,9,7,8.553,7,8
\t\tc0-0.554,0.447-1,1-1h14c0.553,0,1,0.446,1,1C23,8.553,22.553,9,22,9z"/>
</g>
<g id="Layer_1_1_">
</g>
</svg>
          <p class="${page === 'Public' || page === 'Private' ? selected_font : unselected_font} font-6">Chat</p>
        </div>
         <div
          class="flex flex-col items-center"
          id="toggleButton2"
        >
        
        <svg class="top-icon-3 fill-main" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
\t width="32px" height="32px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
<path fill="${page === 'Shelter' || page === 'Review' || page === 'Gallery' || page === 'Incidents' || page === 'Resources' ? selected_color : unselected_color}" d="M29.076,6.816c-0.053,0.009-1.627-0.287-2.957,0.271c-0.416,0.175-1.367,1.063-2.174,0.314
\tc-0.455-0.421-0.608-1.923-0.668-2.06c-0.716-1.571-2.915-1.514-3.166-2.489c-0.193-0.742,0.562-1.521,1.854-0.993
\tc2.846,1.158,3.222,1.196,2.506,0.617c-0.112-0.094-0.292-0.203-0.498-0.318c-0.053-0.034-0.105-0.063-0.149-0.082
\tc-0.046-0.025-0.095-0.052-0.144-0.076C21.39,0.737,18.771,0,15.974,0C10.798,0,6.211,2.462,3.281,6.266
\tc0.013,0,0.023,0.002,0.035,0.002L3.225,6.358c2.059-1.652,0.979,0.14,5.159-1.499c0.15-0.061,1.333-0.17,1.571-0.108
\tc4.3,1.13,6.254-0.026,6.414-0.136c1.982-1.349,3.514-1.032,3.524,0.123c0.006,0.709,0.205,1.509-0.66,1.31
\tc-1.245-0.288-1.964-1.582-2.141-0.167c-0.128,1.029-2.106,1.132-1.788,1.788c0.206,0.426,2.081-0.368,2.93-0.862
\tc0.849-0.493,1.562,0.442,1.617,0.562c0.608,1.313,2.403,1.863,2.589,1.937c1.441,0.571-0.09,1.349-0.933,1.791
\tC21.485,11.107,18,15,16.744,14.709C16.587,14.673,16.207,14.052,16,14c-4-1-1.878,4.661-0.852,2.421
\tc0.428-0.933,0.365,0.462,0.372,1.028c0.007,0.565,0.858,1.124,0.858,1.124c0.035,0.064,0.946,0.164,1.017,0.404l0.279,0.173
\tc0,0,0.521-0.875,1.248-0.796c1.798,0.195,4.612,1.954,4.914,2.104c2.912,1.457,1.931,4.069-0.803,5.511
\tc-0.866,0.461-0.801,2.37-1.819,1.651c-0.578-0.406-2.046,3.475-2.132,4.128c6.292-1.238,11.262-6.155,12.574-12.419
\tc-0.039-0.05-0.08-0.104-0.119-0.164c0.011-0.024,0.021-0.045,0.028-0.061c0.062-0.121,0-0.456-0.029-0.546
\tc-0.03-0.093-0.062-0.152-0.076-0.288c-0.016-0.137,0.015-0.213,0-0.411c-0.016-0.195,0.12-0.181,0.182-0.53
\tc0.061-0.349-0.045-0.256-0.091-0.453c-0.017-0.074,0.021-0.129,0.076-0.181c0.022-0.018,0.049-0.038,0.077-0.063
\tc0.063-0.046,0.13-0.091,0.163-0.143c0.06-0.054,0.087-0.083,0.115-0.118C31.986,16.257,32,16.146,32,16.027
\tC32,12.596,30.913,9.423,29.076,6.816z"/>
<path fill="${page === 'Shelter' || page === 'Review' || page === 'Gallery' || page === 'Incidents' || page === 'Resources' ? selected_color : unselected_color}" d="M17.494,20.159c0.336-0.673-0.737-0.666-1.35-1.157c-0.895-0.718-2.016-1.206-2.224-1.291
\tc-0.445-0.185-2.114-1.734-2.512-2.229c-0.338-0.425-0.098-0.994-0.679-0.739c-0.012,0.005-0.012-0.011-0.016-0.008
\tc-0.386,0.256-0.962,0.106-1.473-1.936c-0.093-0.368-0.075-0.393,0.045-0.562c0.641-0.87-1.501-3.587-1.969-4.151
\tC7.08,7.802,6.268,8.024,5.922,8.073c-0.101-0.06-0.345,0.013-0.438,0.013c-0.107,0,0.014-0.151,0.076-0.271
\tc0.06-0.123-0.063-0.063-0.152-0.078c-0.091-0.014,0.03-0.134,0.09-0.272c0.108-0.238-0.852,0.433-1.09,0.544
\tC4.119,8.146,4.24,8.178,4.15,8.284C4.06,8.39,4.014,8.616,3.906,8.707C3.802,8.8,4.119,8.751,4.21,8.768
\tc0.117,0.02,0.046,0.412-0.212,0.365c0,0-0.397,0.279-0.845,0.519c-0.075,0.015-0.082-0.03-0.074-0.073
\tc0.123-0.079,0.191-0.219,0.335-0.249c0.196-0.042,0.114-0.243,0-0.272c-0.04-0.013-0.058-0.027-0.063-0.049
\tc0.003-0.02,0.003-0.034,0.006-0.044c0.009-0.027,0.031-0.057,0.053-0.09c0.054-0.08-0.306-0.137-0.503-0.137
\tc-0.196,0-0.15-0.121-0.196-0.334c-0.086-0.397,1.069-0.57,0.606-0.858C3.252,7.29,3.052,7.641,2.811,7.562
\tC2.746,7.54,2.638,7.604,2.553,7.669c-0.074,0.054-0.188,0.06-0.273,0.063c-1.473,2.421-2.334,5.253-2.334,8.295
\tc0,8.853,7.175,16.028,16.028,16.028c0.665,0,1.32-0.055,1.965-0.135c-0.006-0.058,0.101-1.663,0.286-2.21
\tc0.2-0.592,0.587-4.079,0.448-4.964C18.471,23.451,18.454,24.053,17.494,20.159z"/>
</svg>
          
          <p class="${page === 'Shelter' || page === 'Review' || page === 'Gallery' || page === 'Incidents' || page === 'Resources' ? selected_font : unselected_font} font-6">Shelter</p>
        </div>
        <div class="flex flex-col items-center" onclick="window.location.href='./welcome_page.html';" >
          <svg
            class="top-icon-3 fill-main"
            width="32"
            height="23"
            viewBox="0 0 32 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_69_171)">
              <path
                d="M28.887 0H2.98803C1.33803 0 3.05176e-05 1.338 3.05176e-05 2.988V19.929C3.05176e-05 21.579 1.33803 22.919 2.98803 22.919H28.887C30.539 22.919 31.875 21.579 31.875 19.929V2.988C31.875 1.338 30.54 0 28.887 0ZM10.102 4.59C11.784 4.59 13.145 6.203 13.145 8.192C13.145 10.181 11.81 12.584 10.127 12.584C8.44403 12.584 7.05803 10.18 7.05803 8.191C7.05803 6.202 8.42003 4.59 10.102 4.59ZM16.206 17.031C16.206 17.635 15.729 17.724 15.173 17.724H10.128H5.07603C4.51703 17.724 4.04503 17.632 4.04503 17.031C4.04503 17.031 3.62303 12.629 6.97803 10.893C7.55503 12.211 8.63803 13.299 10.127 13.299C11.349 13.299 12.606 12.197 13.184 10.878C16.54 12.617 16.206 17.031 16.206 17.031ZM26.875 16H18.875C18.322 16 17.875 15.553 17.875 15C17.875 14.447 18.322 14 18.875 14H26.875C27.428 14 27.875 14.447 27.875 15C27.875 15.553 27.428 16 26.875 16ZM26.875 12H18.875C18.322 12 17.875 11.553 17.875 11C17.875 10.448 18.322 10 18.875 10H26.875C27.428 10 27.875 10.447 27.875 11C27.875 11.552 27.428 12 26.875 12ZM26.875 8H18.875C18.322 8 17.875 7.553 17.875 7C17.875 6.447 18.322 6 18.875 6H26.875C27.428 6 27.875 6.447 27.875 7C27.875 7.553 27.428 8 26.875 8Z"
                fill="${page === 'Directory' ? selected_color : unselected_color}"
              />
            </g>
            <defs>
              <clipPath id="clip0_69_171">
                <rect width="31.875" height="22.921" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="${page === 'Directory' ? selected_font : unselected_font} font-6">Directory</p>
        </div>
        <!--        <a href="./private_page.html">-->
        
        <div
          class="flex flex-col items-center"
          onclick="window.location.href='./announcement_page.html';"
        >
          <svg
            class="top-icon-3 fill-main"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="documents-2" fill="${page === 'Announce' ? selected_color : unselected_color}">
              <path
                d="M21.003,3V1c0-0.553-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1v2h-2.001V1c0-0.553-0.447-1-1-1h-1c-0.552,0-1,0.447-1,1v2
              h-2.001V1c0-0.553-0.448-1-1-1h-1c-0.552,0-1,0.447-1,1v2H6V1c0-0.553-0.448-1-1-1H4C3.448,0,3,0.447,3,1v2C1.343,3,0,4.343,0,6v21
              c0,1.657,1.343,3,3,3h18c1.657,0,3-1.343,3-3V5.997C24,4.342,22.658,3,21.003,3z M3.001,9c0-0.553,0.448-1,1-1h12
              c0.552,0,1,0.447,1,1s-0.448,1-1,1h-12C3.449,10,3.001,9.553,3.001,9z M3.001,14c0-0.553,0.448-1,1-1h14c0.552,0,1,0.447,1,1
              s-0.448,1-1,1h-14C3.449,15,3.001,14.553,3.001,14z M3.001,19c0-0.553,0.448-1,1-1h12c0.552,0,1,0.447,1,1s-0.448,1-1,1h-12
              C3.449,20,3.001,19.553,3.001,19z M21.001,24c0,0.553-0.448,1-1,1h-16c-0.552,0-1-0.447-1-1s0.448-1,1-1h16
              C20.553,23,21.001,23.447,21.001,24z"
              />
            </g>
            <defs>
              <clipPath id="clip0_69_171">
                <rect width="31.875" height="22.921" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="${page === 'Announce' ? selected_font : unselected_font} font-6">Announce</p>
        </div>
        <!--        </a>-->
      </div>
    </footer>
    
    <div id="animatedDiv" class="hidden-panel mb-[-1vh]">
     <div style="width: 40%; height: 8%; background: white" class="flex justify-around pt-8 rounded-[10vw] shadow-xl">
        
        <div
          class="flex flex-col items-center"
          onclick="window.location.href='./chat_page.html';"
        >
          <svg
            class="top-icon-2 fill-main"
            width="32"
            height="28"
            viewBox="0 0 32 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.242 5H4.92203C2.31303 5 3.05176e-05 7.106 3.05176e-05 9.712V18.371C3.05176e-05 20.979 2.31303 23 4.92203 23H12.427L11.29 26.619C11.191 27.238 11.817 27.543 12.363 27.31L21.605 23H22.242C24.849 23 27 20.979 27 18.371V9.712C27 7.106 24.849 5 22.242 5Z"
              fill="${page === 'Public' ? selected_color : unselected_color}"
            />
            <path
              d="M27.242 0H9.92202C7.92002 0 6.10302 1.245 5.36002 3H22.242C25.969 3 29 6.011 29 9.712V17.669C30.748 16.997 32 15.357 32 13.371V4.712C32 2.106 29.849 0 27.242 0Z"
              fill="${page === 'Public' ? selected_color : unselected_color}"
            />
          </svg>
          <p class="${page === 'Public' ? selected_font : unselected_font} font-6">Public</p>
        </div>
        <div
          class="flex flex-col items-center relative"
          id="private_page"
          onclick="window.location.href='./private_list_page.html';"
        >
          <svg
            class="top-icon-2 fill-main"
            width="30"
            height="26"
            viewBox="0 0 30 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_69_168)">
              <path
                d="M28.738 25.208C27.008 24.897 24.968 23.737 23.995 21.587C27.635 19.396 30 15.923 30 12C30 5.373 23.284 0 15 0C6.716 0 0 5.373 0 12C0 18.627 6.716 24 15 24C16.111 24 17.191 23.896 18.232 23.713C21.092 25.688 24.484 26.322 28.642 25.852C28.89 25.832 28.998 25.704 28.998 25.526C29 25.367 28.887 25.238 28.738 25.208ZM9 14C7.896 14 7 13.105 7 12C7 10.896 7.896 10 9 10C10.104 10 11 10.896 11 12C11 13.105 10.104 14 9 14ZM15 14C13.896 14 13 13.105 13 12C13 10.896 13.896 10 15 10C16.104 10 17 10.896 17 12C17 13.105 16.104 14 15 14ZM21 14C19.896 14 19 13.105 19 12C19 10.896 19.896 10 21 10C22.104 10 23 10.896 23 12C23 13.105 22.104 14 21 14Z"
                fill="${page === 'Private' ? selected_color : unselected_color}"
              />
            </g>
            <defs>
              <clipPath id="clip0_69_168">
                <rect width="30" height="26" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="${page === 'Private' ? selected_font : unselected_font} font-6">Private</p>
        </div>
      </div>
    </div>
    
    <div id="animatedDiv2" class="hidden-panel mb-[-1vh]">
     <div style="width: 90%; height: 8%; background: white" class="px-8 flex justify-around pt-8 rounded-[10vw] shadow-xl">
         <div
          class="flex flex-col items-center"
          onclick="window.location.href='./shelter_page.html';"
        >
          <svg
            class="top-icon-2 fill-main"
            width="32"
            height="28"
            viewBox="0 0 32 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="3,24.146 8,26.646 8,10.354 3,7.854 \\t"
              fill="${page === 'Shelter' ? selected_color : unselected_color}"
            />
            <path
              d="M22,23.468l5,1.5V7.459l-3.185-0.637c-0.313,1.661-1.01,3.166-1.815,4.443V23.468z"
              fill="${page === 'Shelter' ? selected_color : unselected_color}"
            />
            <path
              d="M23.886,3.777C23.956,4.175,24,4.582,24,5c0,0.281-0.023,0.556-0.047,0.83L28,6.64v19.673l-7-2.101V24V12.691
           c-0.747,0.959-1.477,1.711-2,2.205v8.249v1.118l-8,4v-1.118V10.854V9.736V9.402C10.94,9.269,10.88,9.137,10.825,9
           c-0.158-0.39-0.292-0.794-0.41-1.207L10,8L0,3v23l10,5l10-5l10,3V5L23.886,3.777z M2,6.236l7,3.5V10v18v0.264l-7-3.5V6.236z"
              fill="${page === 'Shelter' ? selected_color : unselected_color}"
            />
            <path
              d="M17,14c0,0,5-4,5-9c0-2.762-2.238-5-5-5s-5,2.238-5,5C12,10,17,14,17,14z M15,5c0-1.104,0.896-2,2-2s2,0.896,2,2
           s-0.896,2-2,2S15,6.104,15,5z"
              fill="${page === 'Shelter' ? selected_color : unselected_color}"
            />
          </svg>
          <p class="${page === 'Shelter' ? selected_font : unselected_font} font-6">Map</p>
        </div>
        <div
          class="flex flex-col items-center"
          onclick="window.location.href='./shelter_ratings_page.html';"
        >
        <svg class="top-icon-2 fill-main" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="29px"
        height="32px" viewBox="0 0 32 34" style="enable-background:new 0 0 29 32;" xml:space="preserve">
          <g id="duplicate" fill="${page === 'Review' ? selected_color : unselected_color}">
            <path d="M21.954,11h4.741c0.387,0,0.735-0.232,0.882-0.59c0.148-0.355,0.066-0.767-0.206-1.039l-4.742-4.742
              c-0.272-0.272-0.684-0.354-1.039-0.206C21.232,4.569,21,4.918,21,5.305v4.741C21,10.573,21.427,11,21.954,11z"/>
            <path d="M11,1V0.954C11,0.427,10.573,0,10.046,0H2.965C1.327,0,0,1.327,0,2.965v23.07C0,27.673,1.327,29,2.965,29H6V5.965
              C6,3.228,8.228,1,10.965,1H11z"/>
            <path d="M28.046,13h-7.124C19.86,13,19,12.14,19,11.078V3.954C19,3.427,18.573,3,18.046,3h-7.081C9.327,3,8,4.327,8,5.965v23.07
              C8,30.673,9.327,32,10.965,32h15.07C27.673,32,29,30.673,29,29.035V13.954C29,13.427,28.573,13,28.046,13z M21.035,26H15.98
              c-0.553,0-1-0.448-1-1s0.447-1,1-1h5.055c0.552,0,1,0.448,1,1S21.587,26,21.035,26z M22.007,22h-6.972c-0.553,0-1-0.448-1-1
              s0.447-1,1-1h6.972c0.553,0,1,0.448,1,1S22.56,22,22.007,22z"/>
          </g>
          </svg>
          <p class="${page === 'Review' ? selected_font : unselected_font} font-6">Review</p>
        </div>
         <div
          class="flex flex-col items-center"
          onclick="window.location.href='./gallery_main.html';"
        >
          <svg
            class="top-icon-2 fill-main"
            width="32"
            height="32"
            viewBox="0 0 122 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="photo-gallery-icon" fill="${page === 'Gallery' ? selected_color : unselected_color}">
              <path
                d="M5.535,15.447h98.221c1.527,0,2.891,0.62,3.883,1.611c0.99,0.991,1.611,2.396,1.611,3.882v70.134 c0,1.528-0.621,2.891-1.611,3.883c-0.082,0.082-0.166,0.165-0.289,0.247c-0.951,0.868-2.23,1.363-3.635,1.363H5.494 c-1.528,0-2.892-0.619-3.883-1.61S0,92.562,0,91.075V20.941c0-1.528,0.62-2.891,1.611-3.882s2.396-1.611,3.883-1.611H5.535 L5.535,15.447z M28.218,34.489c4.354,0,7.882,3.528,7.882,7.882s-3.528,7.883-7.882,7.883c-4.354,0-7.882-3.529-7.882-7.883 C20.335,38.018,23.864,34.489,28.218,34.489L28.218,34.489z M61.389,68.316l15.766-27.258l16.748,42.363l-78.165-0.001v-5.254 l6.57-0.327l6.567-16.093l3.282,11.496h9.855l8.537-22.004L61.389,68.316L61.389,68.316z M21.891,6.525 c-1.817,0-3.263-1.486-3.263-3.263C18.628,1.445,20.115,0,21.891,0h97.726c1.816,0,3.262,1.487,3.262,3.263v68.895 c0,1.818-1.486,3.264-3.262,3.264c-1.818,0-3.264-1.487-3.264-3.264V6.567H21.891V6.525L21.891,6.525z M102.723,21.974H6.567 v68.027h96.155V21.974L102.723,21.974z"
              />
            </g>
            <defs>
              <clipPath id="clip0_69_171">
                <rect width="18.875" height="18.921" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="${page === 'Gallery' ? selected_font : unselected_font} font-6">Gallery</p>
        </div>
        <div
          class="flex flex-col items-center"
          onclick="window.location.href='./incident_directory.html';"
        >
          <svg
            class="top-icon-2 fill-main"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="documents-2" fill="${page === 'Incidents' ? selected_color : unselected_color}">
              	<path d="M6,16h12c0.553,0,1-0.447,1-1s-0.447-1-1-1H6c-0.553,0-1,0.447-1,1S5.447,16,6,16z"/>
                <path d="M30.038,11.951l-1.563-1.563c-0.424-0.423-1.029-0.511-1.375-0.211l3.149,3.15C30.55,12.981,30.461,12.376,30.038,11.951z"
                    />
                <rect x="24.675" y="11.547" transform="matrix(-0.7056 -0.7086 0.7086 -0.7056 29.7439 48.7147)" width="0.634" height="13.262"/>
                <polygon points="27.652,11.475 18.259,20.803 19.62,22.143 28.969,12.791 	"/>
                <rect x="21.938" y="8.846" transform="matrix(-0.705 -0.7092 0.7092 -0.705 27.0298 42.1948)" width="0.705" height="13.261"/>
                <polygon points="15.963,23.48 15.517,24.911 16.938,24.454 	"/>
                <polygon points="20.065,23.453 16.941,20.359 16.21,22.834 17.505,24.234 	"/>
                <path d="M22,27c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V10c0-1.654,1.346-3,3-3h1c0,1.657,1.343,3,3,3h6c1.657,0,3-1.343,3-3h1
                    c1.654,0,3,1.346,3,3v3.853l2-2V10c0-2.762-2.238-5-5-5h-1.277C17.548,4.7,17.3,4.452,17,4.277V2c0-1.104-0.896-2-2-2H9
                    C7.896,0,7,0.896,7,2v2.277C6.7,4.452,6.452,4.7,6.277,5H5c-2.762,0-5,2.238-5,5v17c0,2.762,2.238,5,5,5h14c2.762,0,5-2.238,5-5
                    v-5.967l-2,2V27z M10,2h4c0.553,0,1,0.447,1,1s-0.447,1-1,1h-4C9.447,4,9,3.553,9,3S9.447,2,10,2z"/>
                <path d="M16.646,19.207L17.853,18H6c-0.553,0-1,0.447-1,1s0.447,1,1,1h10.023C16.152,19.728,16.571,19.281,16.646,19.207z"/>
                <path d="M5,23c0,0.553,0.447,1,1,1h8.753c0.151-0.481,0.377-1.202,0.626-2H6C5.447,22,5,22.447,5,23z"/>
            </g>
            <defs>
              <clipPath id="clip0_69_171">
                <rect width="31.875" height="22.921" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="${page === 'Incidents' ? selected_font : unselected_font} font-6">Incidents</p>
        </div>
        <div
          class="flex flex-col items-center"
          onclick="window.location.href='./resources_page.html';"
        >
          <svg
            class="top-icon-2 fill-main"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="documents-2" fill="${page === 'Resources' ? selected_color : unselected_color}">
              	<path d="M12.551,2.918C12.687,2.377,13.17,2,13.728,2h4.545c0.558,0,1.041,0.377,1.177,0.918L19.72,4h2.061l-0.392-1.566
\t\tC21.031,1,19.749,0,18.272,0h-4.545c-1.477,0-2.759,1-3.116,2.433L10.22,4h2.061L12.551,2.918z"/>
\t<path d="M16,11c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6S19.309,11,16,11z M21,17c0,0.553-0.447,1-1,1h-3v3
\t\tc0,0.553-0.447,1-1,1s-1-0.447-1-1v-3h-3c-0.553,0-1-0.447-1-1s0.447-1,1-1h3v-3c0-0.552,0.447-1,1-1s1,0.448,1,1v3h3
\t\tC20.553,16,21,16.447,21,17z"/>
\t<path d="M29,6H3C1.343,6,0,7.343,0,9v16c0,1.657,1.343,3,3,3h26c1.657,0,3-1.343,3-3V9C32,7.343,30.657,6,29,6z M16,25
\t\tc-4.411,0-8-3.589-8-8s3.589-8,8-8s8,3.589,8,8S20.411,25,16,25z"/>
            </g>
            
            
            
            <defs>
              <clipPath id="clip0_69_171">
                <rect width="31.875" height="22.921" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="${page === 'Resources' ? selected_font : unselected_font} font-6">Resources</p>
        </div>
        
     </div>
    
          
        
    </div>
    `;
    document
      .getElementById('toggleButton1')
      .addEventListener('click', function () {
        var div2 = document.getElementById('animatedDiv2');
        div2.classList.remove('active');
        var div = document.getElementById('animatedDiv');
        div.classList.toggle('active'); // 切换 active 类来触发动画
      });

    document
      .getElementById('toggleButton2')
      .addEventListener('click', function () {
        var div2 = document.getElementById('animatedDiv');
        div2.classList.remove('active');
        var div = document.getElementById('animatedDiv2');
        div.classList.toggle('active'); // 切换 active 类来触发动画
      });
  }
}

customElements.define('footer-component', Footer_component);

/*
* <div class="flex justify-around border-t border-hui pt-8 ml-5">



      </div>*/
