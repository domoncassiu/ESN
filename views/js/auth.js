// display popup or not on load
document.addEventListener('DOMContentLoaded', async function () {
  let state = true;
  // fetch validation status
  const response = await fetch('/auth/acknowledgement', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const myButton = document.getElementById('logout_button');

  myButton.addEventListener('click', function () {
    logout();
  });

  const data = await response.json();

  if (response.status === 200) {
    console.log('Already acked:', data.acknowledged);
    if (data.acknowledged) {
      state = true;
    } else {
      state = false;
    }
  } else if (response.status === 503) {
    console.log('redirect to main page:');
    window.location.href = './pause_page.html';
  } else {
    console.log('Not yet acked:', data);
    state = false;
  }

  // hide the dialog if acked
  if (state == false) {
    const dialog1 = document.getElementById('dialog1');
    const dialog2 = document.getElementById('dialog2');
    const dialog3 = document.getElementById('dialog3');
    dialog1.style.display = '';
    dialog2.style.display = '';
    dialog3.style.display = '';
  }
});

// handle logout button
async function logout() {
  // clear the token
  localStorage.removeItem('token');

  // redirect here
  window.location.href = './register_page.html';
}

// handle logout button
async function test_sigrid() {
  console.log('test sigrid');
}
