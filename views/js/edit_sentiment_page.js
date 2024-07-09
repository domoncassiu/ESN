import { read, showPopup } from './utils.js';
import {
  getGroupMessage,
  initializeSocket,
  subscribeToPrivateAndTesting,
  updateSentiment,
} from './endpoints.js';

document.addEventListener('DOMContentLoaded', async function () {
  const myButton = document.getElementById('confirm');

  myButton.addEventListener('click', function () {
    read();
  });

  // establish socket connection
  let socket = await initializeSocket();
  socket = await subscribeToPrivateAndTesting(socket);

  // // get all the messages
  const queryStringParams = new URLSearchParams(window.location.search);
  const incidentId = queryStringParams.get('incidentId');
  if (incidentId === null || incidentId === undefined) {
    return;
  }
  const messageId = queryStringParams.get('messageId');
  if (messageId === null || messageId === undefined) {
    return;
  }

  // get message
  const message = await getGroupMessage(incidentId, messageId);
  if (message.sentiment !== null && message.sentiment !== undefined) {
    document.getElementById('messageText').innerText = message.message;
    document.getElementById('messageText').classList.add('text-stone-900');
    document.getElementById('score').value = message.sentiment.score;
    document.getElementById('magnitude').value = message.sentiment.magnitude;
  }

  // Register on-click events
  const updateSentimentButton = document.getElementById(
    'update_sentiment_button',
  );
  updateSentimentButton.addEventListener(
    'click',
    function () {
      updateMessageSentiment(incidentId, messageId);
    },
    false,
  );
});

// ---- helper functions ----

async function updateMessageSentiment(incidentId, messageId) {
  console.log('Updating sentiment');
  const newScore = document.getElementById('score').value;
  const newMagnitude = document.getElementById('magnitude').value;

  let sentimentBody = {
    sentiment: {
      score: newScore,
      magnitude: newMagnitude,
    },
  };
  await updateSentiment(incidentId, messageId, sentimentBody);

  window.location.href = `./group_chat_page.html?incidentId=${incidentId}`;
}
