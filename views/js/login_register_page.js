document.addEventListener('DOMContentLoaded', function () {
  const myButton = document.getElementById('confirm');

  myButton.addEventListener('click', function () {
    confirm();
  });

  const cancel = document.getElementById('cancel');

  cancel.addEventListener('click', function () {
    cancel();
  });

  const register_button = document.getElementById('register_button');

  register_button.addEventListener('click', function () {
    validate();
  });

  const esn = document.getElementById('esn');
  const input = document.getElementsByClassName('inputs')[0];
  const message = document.getElementsByClassName('welcome_message')[0];
  const button = document.getElementsByClassName('front_page_button')[0];
  const register = document.getElementById('register_button');

  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  console.log(screenHeight);
  console.log(screenWidth);

  //2124 980
  if (screenHeight < screenWidth) {
    esn.style.marginLeft = `${-3}vw`;
    input.style.width = '30vw';
    input.style.marginLeft = '35vw';
    input.style.fontSize = '5vh';
    message.style.marginLeft = '35%';
    button.style.width = '30vw';
    button.style.marginLeft = '35vw';
    button.style.height = '10vh';
  }
});

// handle register button
async function validate() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const dialog = document.getElementById('confirm_dialog');
  const confirm_panel = document.getElementById('confirm_panel');
  const confirm_back = document.getElementById('confirm_back');

  const response = await fetch('/auth/validation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  console.log(data);

  if (response.status === 200) {
    console.log('validate successful:', data.message);

    // pop up for confirmation
    dialog.classList.remove('invisible');
    dialog.classList.add('visible');

    confirm_panel.classList.remove(
      'opacity-0',
      'translate-y-4',
      'sm:translate-y-0',
      'sm:scale-95',
    );
    confirm_panel.classList.add('opacity-100', 'translate-y-0', 'sm:scale-100');
    confirm_back.classList.remove('opacity-0');
    confirm_back.classList.add('opacity-100');

    confirm_back.classList.remove('ease-out', 'duration-300');
    confirm_back.classList.add('ease-in', 'duration-200');

    confirm_panel.classList.remove('ease-out', 'duration-300');
    confirm_panel.classList.add('ease-in', 'duration-200');
  } else {
    console.error('validate failed:', data.message);

    // if user exists call login endpoint
    if (response.status === 409) {
      // perform the login method
      console.log('performing login');
      login(username, password);
    } else {
      // update html
      document.getElementById('error_message').innerText = data.message;
      document.getElementById('error_message').style.opacity = 100;
    }
  }
}

// handle cancel button
async function cancel() {
  const dialog = document.getElementById('confirm_dialog');
  const confirm_panel = document.getElementById('confirm_panel');
  const confirm_back = document.getElementById('confirm_back');

  // pop up for confirmation
  dialog.classList.remove('visible');
  dialog.classList.add('invisible');

  confirm_panel.classList.remove(
    'opacity-100',
    'translate-y-0',
    'sm:scale-100',
  );
  confirm_panel.classList.add(
    'opacity-0',
    'translate-y-4',
    'sm:translate-y-0',
    'sm:scale-95',
  );
  confirm_back.classList.remove('opacity-100');
  confirm_back.classList.add('opacity-0');

  confirm_back.classList.remove('ease-in', 'duration-200');
  confirm_back.classList.add('ease-out', 'duration-300');

  confirm_panel.classList.remove('ease-in', 'duration-200');
  confirm_panel.classList.add('ease-out', 'duration-300');
}

// handle confirm button
async function confirm() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log(username);

  const response = await fetch('/auth/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.status === 200) {
    console.log('Register successful:', data.accessToken);
    // set token here
    localStorage.setItem('token', data.accessToken);

    console.log('Register successful, adding status');

    // redirect here
    window.location.href = './welcome_page.html';
  } else {
    console.error('Login failed:', data.message);

    // update html
    document.getElementById('error_message').innerText = data.message;
    document.getElementById('error_message').style.opacity = 100;
  }
}

// handle login button
async function login(username, password) {
  const login_response = await fetch('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const login_data = await login_response.json();
  console.log(login_data);

  if (login_response.status === 200) {
    console.log('login successful');

    // stroe token
    localStorage.setItem('token', login_data.accessToken);
    localStorage.setItem('username', login_data.username);

    // emit a online status to all the users

    // redirect to welcome page
    window.location.href = './welcome_page.html';
  } else {
    console.error('Login failed:', login_data.message);

    // update html
    document.getElementById('error_message').innerText = login_data.message;
    document.getElementById('error_message').style.opacity = 100;
  }
}
