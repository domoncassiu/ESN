import { getShelterRatingList } from './endpoints.js';

// on page load
document.addEventListener('DOMContentLoaded', async function () {
  // get all the shelters with ratings
  const shelters = await getShelterRatingList(
    'overall',
    0,
    5,
    'overall',
    false,
  );
  console.log(shelters);

  if (shelters) {
    const shelterContainer = document.getElementById('shelterContainer');
    shelters.forEach((shelter) => {
      const shelterElement = updateShelter(shelter);
      console.log(shelterElement);
      shelterContainer.appendChild(shelterElement);
      shelterElement.scrollIntoView(false);
    });
  }

  // toggle sort
  const sortImg = document.getElementById('sortToggle');
  sortImg.addEventListener('click', function () {
    if (sortImg.src.includes('sort_desc.svg')) {
      sortImg.src = '../images/sort_asc.svg';
    } else {
      sortImg.src = '../images/sort_desc.svg';
    }
  });

  // search button
  const searchBtn = document.getElementById('search_review_button');
  searchBtn.addEventListener('click', async function () {
    try {
      const filterName = document.getElementById('filter').value.toLowerCase();
      const min = document.getElementById('rating-min').value
        ? document.getElementById('rating-min').value
        : 0;
      const max = document.getElementById('rating-max').value
        ? document.getElementById('rating-max').value
        : 5;
      const sortBy = document.getElementById('sort').value.toLowerCase();
      const ascending = document
        .getElementById('sortToggle')
        .src.includes('asc');
      const shelterList = await getShelterRatingList(
        filterName,
        min,
        max,
        sortBy,
        ascending,
      );

      const shelterContainer = document.getElementById('shelterContainer'); // Replace with your actual container ID
      const keepElementId = 'sort-filter-search';
      Array.from(shelterContainer.children).forEach((child) => {
        if (child.id !== keepElementId) {
          shelterContainer.removeChild(child);
        }
      });

      // Display the new list of shelters on the page
      shelterList.forEach((shelter) => {
        const shelterElement = updateShelter(shelter);
        console.log(shelterElement);
        shelterContainer.appendChild(shelterElement);
        shelterElement.scrollIntoView(false);
      });
    } catch (error) {
      console.error('Error fetching shelter list:', error);
      // Handle errors, maybe show a user-friendly message
    }
  });
});

// ---- helper functions ----
// add message block
export function updateShelter(shelter) {
  const shelterContainer = document.createElement('div');
  shelterContainer.classList.add(
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

  const shelterInfo = document.createElement('div');
  shelterInfo.classList.add(
    'text-4xl',
    'flex',
    'items-center',
    'space-x-2',
    'rtl:space-x-reverse',
    'justify-between',
  );

  const locationParagraph = document.createElement('span');
  locationParagraph.classList.add(
    'font-bold',
    'text-black-500',
    'dark:text-black-400',
  );
  locationParagraph.textContent = shelter._id;

  const ratingContainer = document.createElement('span');
  ratingContainer.classList.add(
    'font-bold',
    'text-black-500',
    'dark:text-black-400',
    'flex',
    'items-center',
  );
  const ratingText = document.createTextNode(shelter.overall.toFixed(1));
  const img = document.createElement('img');
  img.src = '../images/star.svg';
  img.classList.add('w-9', 'h-9', 'items-center');
  ratingContainer.appendChild(img);
  ratingContainer.appendChild(ratingText);
  shelterInfo.appendChild(locationParagraph);
  shelterInfo.appendChild(ratingContainer);

  shelterContainer.appendChild(shelterInfo);

  shelterContainer.addEventListener('click', function () {
    localStorage.setItem('shelterLocation', shelter._id);
    console.log(localStorage.getItem('shelterLocation'));
    window.location.href = `./shelter_details_page.html?shelterId=${encodeURIComponent(shelter._id)}`;
  });

  return shelterContainer;
}
