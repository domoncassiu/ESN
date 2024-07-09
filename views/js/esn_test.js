document.addEventListener('DOMContentLoaded', async function () {
  // show popup
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', function () {
    startTest();
  });

  const stopButton = document.getElementById('stopButton');

  stopButton.addEventListener('click', function () {
    stopTest();
  });
});

// Set up interval to call intervalFunction every testInterval milliseconds

let intervalIdPost = null;
let intervalIdGet = null;
let testCounter = 0;
let totalNumberOfTests = 0;
let testInterval = 0;
let testDuration = 0;
let completedPost = 0;
let completedGet = 0;
let duration = 0;

function renderTestMessage(message) {
  const testMessage = document.getElementById('messageContainer');
  testMessage.innerHTML += '<br>' + message;
}

function incrementTestCounter() {
  testCounter++;
  // renderTestMessage(`Test number: ${testCounter}`);
  if (testCounter > 1000) {
    stopTest()
      .then((r) => renderTestMessage('Test stopped successfully.'))
      .catch((err) => renderTestMessage('Test could not be stopped!!!'));
    clearRequestIntervals();
  } else if (testCounter > totalNumberOfTests) {
    stopTest()
      .then((r) => renderTestMessage('Test stopped successfully.'))
      .catch((err) => renderTestMessage('Test could not be stopped!!!'));
    clearRequestIntervals();
  } else if (testCounter === Math.round(totalNumberOfTests / 2)) {
    clearInterval(intervalIdPost);
    intervalIdGet = setInterval(ExecuteGetTest, testInterval);
  }
}

function clearRequestIntervals() {
  try {
    clearInterval(intervalIdGet);
    clearInterval(intervalIdPost);
    testCounter = 0;
    totalNumberOfTests = 0;
    testInterval = 0;
    testDuration = 0;
    // renderTestMessage('Cleared request intervals!');
  } catch (e) {
    // do nothing if timeout invalidation fails
  }
}

// POST test
async function ExecutePostTest() {
  try {
    const testMessage = 'tisis20characterlong';
    let result = await postMessage(testMessage);
    // renderTestMessage(`Post Result: ${result}`);
    if (result) {
      completedPost++;
      renderTestMessage(`Completeed Post: ${completedPost}`);
    }
    // TODO: add to report
  } catch (e) {
    renderTestMessage(`Post failed: ${e}`);
  }
  incrementTestCounter();
}

// GET test
async function ExecuteGetTest() {
  try {
    let result = await getMessages();
    //  renderTestMessage(`Get Result: ${result}`);
    if (result) {
      completedGet++;
      renderTestMessage(`Completed Get: ${completedGet}`);
    }
    // TODO: add to report
  } catch (e) {
    renderTestMessage(`Get failed: ${e}`);
  }
  incrementTestCounter();
}

// onClick handler
async function startTest() {
  const testIntervalStr = document.getElementById('testInterval').value;
  const testDurationStr = document.getElementById('testDuration').value;
  const testMessage = document.getElementById('messageContainer');
  testMessage.innerHTML = '';
  testCounter = 0;
  try {
    testInterval = parseInt(testIntervalStr);
    testDuration = parseInt(testDurationStr);
    duration = testDuration;
    totalNumberOfTests = (testDuration * 1000) / testInterval;
    if (testDuration > 5) {
      renderTestMessage('Test duration must be within 5 seconds.');
      return;
    }
    if (isNaN(totalNumberOfTests)) {
      renderTestMessage('Invalid testInterval');
      return;
    }
    // renderTestMessage(`Total Number: ${totalNumberOfTests}`);
    let response = null;
    try {
      response = await fetch(`/speedtests`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testInterval: testInterval,
          testDuration: testDuration,
          test: 'START',
        }),
      });
    } catch (e) {
      // error parsing, return
      renderTestMessage('Invalid testInterval');
      return;
    }

    await response.json();
    if (response.status !== 200) {
      console.log('Error starting test on server!');
      renderTestMessage('Error starting test on server!');

      return;
    }

    intervalIdPost = setInterval(ExecutePostTest, testInterval);
  } catch (error) {
    console.error('Error:', error);
    renderTestMessage(`Error: ${error}`);
  }
}

// onClick handler
async function stopTest() {
  try {
    const response = await fetch(`/speedtests`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: 'STOP',
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log(
        `completed get request:${completedGet} completed post request: ${completedPost}`,
      );
      renderTestMessage(
        `<br> Speed test result: <br> completed get request:${completedGet} <br> completed post request: ${completedPost}`,
      );
      renderTestMessage(
        `${completedGet / duration}  get requst per second <br> ${completedPost / duration}  post requst per second`,
      );
      clearRequestIntervals();
      return data;
    } else {
      console.error('Something happened with the test');
      renderTestMessage('Something happened with the test');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    renderTestMessage(`Error: ${error}`);
  }
}

// get message endpoint
async function getMessages(page = 1, ascending = true) {
  const queryParams = `?page=${page}&ascending=${ascending}`;

  try {
    const response = await fetch(`/chatRooms/public${queryParams}`, {
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

// post message endpoint
async function postMessage(message) {
  const response = await fetch('/chatRooms/public', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  if (response.status === 201) {
    console.log('Post successful:', data);
    renderTestMessage('Post successful:', data);
    return data;
  } else {
    console.error('Post failed:', data);
    return null;
  }
}
