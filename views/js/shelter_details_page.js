import {
  getThisShelterRatings,
  getThisShelterReviews,
  updateThisReview,
  deleteThisReview,
} from './endpoints.js';

const categories = [
  'overall',
  'cleanliness',
  'amenities',
  'capacity',
  'communication',
];

// on page load
document.addEventListener('DOMContentLoaded', async function () {
  // get ratings and reviews for this shelter
  const urlParams = new URLSearchParams(window.location.search);
  const shelterLocation = urlParams.get('shelterId');
  localStorage.setItem('shelterLocation', shelterLocation);
  const ratings = await getThisShelterRatings(shelterLocation);
  const reviews = await getThisShelterReviews(shelterLocation);

  const shelterReviewContainer = document.getElementById(
    'shelterReviewContainer',
  );

  categories.forEach((category) => {
    document.getElementById(`rating-${category}`).textContent =
      ratings[category].toFixed(1);
  });

  if (reviews) {
    reviews.forEach(async (review) => {
      const reviewElement = await updateReview(review);
      console.log(reviewElement);
      shelterReviewContainer.appendChild(reviewElement);
      reviewElement.scrollIntoView(false);
    });
  }
});

document
  .getElementById('review-shelter-button')
  .addEventListener('click', function () {
    window.location.href = '../html/shelter_review_page.html';
  });

// ---- helper functions ----
// add review block
export async function updateReview(review) {
  const reviewContainer = document.createElement('div');
  reviewContainer.classList.add(
    'p-7',
    'flex',
    'flex-col',
    'gap-2.5',
    'w-full',
    'leading-1.5',
    'p-4',
    'border-black-200',
    'bg-red-100',
    'rounded-e-3xl',
    'rounded-es-3xl',
    'mb-7',
  );
  reviewContainer.id = review._id;

  const reviewInfo = document.createElement('div');
  reviewInfo.classList.add(
    'text-4xl',
    'flex',
    'items-center',
    'space-x-2',
    'rtl:space-x-reverse',
    'justify-between',
  );

  const reviewerParagraph = document.createElement('span');
  reviewerParagraph.classList.add('text-black-500', 'dark:text-black-400');
  reviewerParagraph.textContent = review.reviewer;

  const timestampContainer = document.createElement('span');
  timestampContainer.classList.add(
    'text-black-500',
    'dark:text-black-400',
    'flex',
    'items-center',
  );
  const timestampText = document.createTextNode(
    new Date(review.timestamp).toLocaleString(),
  );

  const messageContainer = document.createElement('span');
  messageContainer.classList.add('text-gray-500', 'font-7');
  const messageText = document.createTextNode(review.message);

  timestampContainer.appendChild(timestampText);
  reviewInfo.appendChild(reviewerParagraph);
  reviewInfo.appendChild(timestampContainer);
  messageContainer.appendChild(messageText);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('review-buttons-container');

  const editButton = document.createElement('button');
  editButton.textContent = 'edit';
  editButton.classList.add('edit-button');
  editButton.addEventListener('click', async function () {
    await showUpdateModal(review);
  });
  buttonsContainer.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'delete';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', async function () {
    try {
      const response = await deleteThisReview(review.reviewer, review._id);
      console.log(response);
      if (!response) {
        showUnauthorizedModal();
      } else {
        const containerToDelete = document.getElementById(review._id);
        containerToDelete.remove();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  });
  buttonsContainer.appendChild(deleteButton);

  reviewContainer.appendChild(reviewInfo);
  reviewContainer.appendChild(messageContainer);
  reviewContainer.appendChild(buttonsContainer);

  return reviewContainer;
}

function showUnauthorizedModal() {
  var modal = document.getElementById('unauthorized-modal');
  var okButton = document.getElementById('ok-button');

  okButton.onclick = function () {
    modal.style.display = 'none';
  };

  modal.style.display = 'block';
}

async function showUpdateModal(review) {
  console.log(review);
  var modal = document.getElementById('update-modal');
  var submitButton = document.getElementById('update-button');
  var cancelSubmitButton = document.getElementById('cancel-update-button');

  submitButton.onclick = function () {};
  submitButton.addEventListener('click', async function () {
    try {
      modal.style.display = 'none';
      const updatedMessage = document.getElementById(
        'update-review-message',
      ).value;
      const response = await updateThisReview(review._id, updatedMessage);
      if (!response) {
        showUnauthorizedModal();
      } else {
        const containerToEdit = document.getElementById(review._id);
        const messageSpan = containerToEdit.querySelector('.text-gray-500');
        messageSpan.textContent = updatedMessage;
      }
    } catch (error) {
      console.error('Error editing review:', error);
    }
  });
  cancelSubmitButton.onclick = function () {
    modal.style.display = 'none';
  };
  modal.style.display = 'block';
}
