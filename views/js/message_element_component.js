class Message_element_component extends HTMLElement {
  static observedAttributes = [
    'username',
    'userId',
    'safetyStatus',
    'onclick',
    'center',
    'isModerator',
    'color',
    'message',
    'messageId',
    'incidentId',
    'timestamp',
  ];

  connectedCallback() {
    let username = this.getAttribute('username');
    let userId = this.getAttribute('userId');
    let safetyStatus = this.getAttribute('safetyStatus'); // Safe, Help, Emergency, Undefined
    let isModerator = this.getAttribute('isModerator');
    let color = this.getAttribute('color');
    let message = this.getAttribute('message');
    let messageId = this.getAttribute('messageId');
    let incidentId = this.getAttribute('incidentId');
    let timestamp = this.getAttribute('timestamp');

    console.log(color, color, color);

    this.innerHTML = `
            <div class="message-container flex mt-4 mb-4" style="${color};">
                <img src="../images/${safetyStatus.toLowerCase()}.svg" class="top-icon fill-main ml-3">
                <div class="message-info ml-4">
                    <p class="font-6">
                        <span class="text-bold font-8">${username}</span> 
                        <span class="font-bold-300">${timestamp}</span>
                    </p>
                    <p class="font-7 text-black font-bold-300 break_all">${message}</p>
                    <div class="mt-4 flex flex-row mb-4" style="${isModerator === 'true' ? 'display: flex' : 'display: none'}">
                        <button id="edit|${messageId}" type="button" class="inline-flex items-center justify-center w-16 h-16 mr-2 text-gray-700 transition-colors duration-150 bg-blue-100 rounded-full focus:shadow-outline hover:bg-gray-200" onclick="window.location.href='./edit_sentiment_page.html?incidentId=${incidentId}&messageId=${messageId}'">
                            <svg class="w-8 h-8 fill-current" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define('message-element', Message_element_component);
