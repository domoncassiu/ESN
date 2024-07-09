class User_component extends HTMLElement {
  static observedAttributes = [
    'username',
    'userId',
    'safetyStatus',
    'onclick',
    'center',
  ];
  connectedCallback() {
    let username = this.getAttribute('username');
    let userId = this.getAttribute('userId');
    let safetyStatus = this.getAttribute('safetyStatus'); // Safe, Help, Emergency, Undefined
    let onclick = this.getAttribute('onclick');
    let center = this.getAttribute('center');
    this.innerHTML = `
            <div class="message-container flex ${center === 'true' ? 'items-center' : ''}" id="${userId}" onclick="${onclick}">
                <img src="../images/${safetyStatus.toLowerCase()}.svg" class="top-icon fill-main ml-3">
                <p class="font-8 ml-1">${username}</p>
            </div>
        `;
  }
}

customElements.define('user-component', User_component);
