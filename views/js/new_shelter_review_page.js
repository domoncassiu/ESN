const nextButton = document.getElementById('next-button');
const inputs = ['street', 'city', 'state', 'zipcode'];

if (nextButton) {
  nextButton.addEventListener('click', async function (event) {
    event.preventDefault();
    if (validateAddress()) {
      const street = document.getElementById('street').value;
      const city = document.getElementById('city').value;
      const state = document.getElementById('state').value;
      const zipcode = document.getElementById('zipcode').value;

      localStorage.setItem(
        'shelterLocation',
        `${street}, ${city}, ${state} ${zipcode}`,
      );
      window.location.href = './shelter_review_page.html';
    }
  });
}

function validateAddress() {
  let isValid = true;

  inputs.forEach((input) => {
    console.log(input);
    let inputValue = document.getElementById(input).value;
    if (!inputValue.trim()) {
      document.getElementById(`error-message-${input}`).textContent =
        'Please provide a review message.';
      isValid = false;
    } else {
      document.getElementById(`error-message-${input}`).textContent = '';
    }
  });

  return isValid;
}
