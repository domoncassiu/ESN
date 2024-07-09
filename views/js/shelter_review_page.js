import { submitReview } from './endpoints.js';

const shelterLocation = localStorage.getItem('shelterLocation');
const categories = [
  'cleanliness',
  'amenities',
  'capacity',
  'communication',
  'overall',
];
const ratingsContainer = document.getElementById('ratings-container');
let ratings = {
  overall: 0,
  cleanliness: 0,
  amenities: 0,
  capacity: 0,
  communication: 0,
};
let isValid = true;

categories.forEach((category) => {
  const starRatingContainer = ratingsContainer.querySelector(
    `.star-rating[data-category="${category}"]`,
  );

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('img');
    star.src = '../images/star-gray.svg';
    star.classList.add('star', 'yellow', 'h-12', 'w-12');
    star.dataset.ratingValue = i;
    star.addEventListener('click', function () {
      setRating(category, i, ratingsContainer);
    });
    starRatingContainer.appendChild(star);
  }
});

document
  .getElementById('submit-button')
  .addEventListener('click', async function (event) {
    event.preventDefault();
    if (validateRatings()) {
      await submitReview(
        ratings,
        document.getElementById('review-message').value,
        shelterLocation,
      );
      showConfirmationModal();
      // window.location.href = '../html/shelter_ratings_page.html';
    }
  });

function setRating(category, rating, ratingsContainer) {
  const stars = ratingsContainer.querySelectorAll(
    `.star-rating[data-category="${category}"] .star`,
  );
  ratings[category] = rating;
  console.log(ratings);

  stars.forEach((star, index) => {
    if (index < rating) {
      star.src = '../images/star.svg';
    } else {
      star.src = '../images/star-gray.svg';
    }
  });
}

function showStarError(category, message) {
  const errorSpan = document.getElementById(`error-message-${category}`);
  console.log(errorSpan);
  errorSpan.textContent = message;
}

function clearStarError(category) {
  console.log(category);
  const errorSpan = document.getElementById(`error-message-${category}`);
  errorSpan.textContent = '';
}

function validateRatings() {
  isValid = true;

  categories.forEach((category) => {
    if (!ratings[category]) {
      showStarError(category, 'Please provide a rating.');
      isValid = false;
    } else {
      clearStarError(category);
    }
  });
  const reviewMessage = document.getElementById('review-message').value;
  if (!reviewMessage.trim()) {
    document.getElementById('error-message-review').textContent =
      'Please provide a review message.';
    isValid = false;
  } else {
    document.getElementById('error-message-review').textContent = '';
  }

  return isValid;
}

function showConfirmationModal(
  message = 'Your review has been submitted successfully.',
) {
  // Get the modal
  var modal = document.getElementById('confirmation-modal');
  var okButton = document.getElementById('ok-button');

  // When the user clicks on OK button, close the modal and redirect
  okButton.onclick = function () {
    modal.style.display = 'none';
    window.location.href = '../html/shelter_ratings_page.html';
  };

  modal.querySelector('p').textContent = message;
  modal.style.display = 'block';
}
