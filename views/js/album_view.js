import { genericGet, initializeSocket } from './endpoints.js';

// on page load:
let albumName;
document.addEventListener('DOMContentLoaded', async () => {
  // establish socket connection
  const socket = await initializeSocket();
  socket.on('joinedAlbumRoom', async (msg) => {
    console.log(msg);
  });
  socket.on('newImage', async (msg) => {
    console.log(msg);
    updateAlbumWithNewImages(albumName);
  });
  socket.on('deleteImage', async (msg) => {
    console.log(msg);
    updateAlbumWithNewImages(albumName);
  });
  // fetch the latest images for each album to use as thumbnail
  const params = new URLSearchParams(window.location.search);
  albumName = params.get('albumName');
  if (params.get('fromDelete')) {
    window.alert('Image Successfully Deleted!');
    let urlObject = new URL(window.location.href);
    urlObject.searchParams.delete('fromDelete');
    window.location.href = urlObject.toString();
  }
  if (params.get('beenDeleted')) {
    window.alert('Image was recently deleted!');
    let urlObject = new URL(window.location.href);
    urlObject.searchParams.delete('beenDeleted');
    window.location.href = urlObject.toString();
  }
  console.log(albumName);
  const h1Element = document.getElementById('albumTitle');
  if (h1Element) {
    h1Element.textContent = `${albumName} Album`;
  }

  // get all images url
  const images = await genericGet(`/galleries/${albumName}`);
  images.forEach(async (image) => {
    await addToAlbumContainer(image.imageUrl, albumName);
  });
  setTimeout(() => subscribeToAlbumUpdate(albumName), 1000);
});

const input = document.getElementById('imageUpload');
const fileNameDisplay = document.getElementById('fileName');
input.addEventListener('change', () => {
  let files = input.files;
  if (files && files.length > 0) {
    let filenames = Array.from(files).map((file) => file.name);
    if (filenames.length > 3) {
      filenames = filenames.slice(0, 3);
      filenames.push('...');
    }
    fileNameDisplay.textContent = filenames.join(', ');
    fileNameDisplay.style.fontSize = '12px';
    fileNameDisplay.style.textAlign = 'center';
    // if (!document.getElementById('uploadButton')) {
    //   var uploadButton = document.createElement('button');
    //   uploadButton.id = 'uploadButton';
    //   uploadButton.className =
    //     'bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded-lg text-center';
    //   uploadButton.textContent = 'Upload Image';
    //   document.getElementById('upload').appendChild(uploadButton);

    const getUploadButton = document.getElementById('uploadButton');
    getUploadButton.hidden = false;
    getUploadButton.addEventListener('click', async (event) => {
      event.preventDefault();
      fileNameDisplay.textContent = '';
      let formData = new FormData();
      Array.from(files).forEach((file) => {
        console.log(file);
        formData.append('images', file);
      });
      console.log(formData);
      try {
        await postImages(albumName, formData);
        getUploadButton.hidden = true;
        files = null;
      } catch (err) {
        console.log(err);
      }
      fileNameDisplay.textContent = 'Image Succesfully Uploaded!';
      setTimeout(() => (fileNameDisplay.textContent = ''), 1500);
    });
  }
});

// const image = document.getElementById('image')
// image.addEventListener('click', () => {
//     const src = image.src; // Get the source of the image
//     console.log(src); // Print the filename (optional)

//     // Redirect to the image view page with the filename as a query parameter
//     window.location.href = `image_view.html?src=${src}&albumName=${albumName}`;
// });

async function postImages(albumName, formData) {
  console.log(formData);
  const response = await fetch(`/galleries/${albumName}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  if (response.status === 201) {
    console.log('Post successful:');
  } else {
    console.error('Post failed:', data);
    return null;
  }
}

async function subscribeToAlbumUpdate(albumName) {
  const response = await fetch(`/galleries/${albumName}/live`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.status === 204) {
    console.log('Put successful:', data);
    return data;
  } else {
    console.error('Put failed:', data);
    return null;
  }
}

async function addToAlbumContainer(src, albumName) {
  const albumContainer = document.getElementById('album-container');
  if (albumContainer) {
    // Create the elements
    const anchorElement = document.createElement('a');
    const divElement = document.createElement('div');
    const imgElement = document.createElement('img');

    // Set attributes for the elements
    anchorElement.classList.add('group');
    anchorElement.href = `image_view.html?src=${src}&albumName=${albumName}`;
    divElement.classList.add('flex', 'flex-col', 'items-center');
    imgElement.id = 'image';
    imgElement.classList.add(
      'w-[15vh]',
      'md:w-[30vh]',
      'h-[10vh]',
      'md:h-[15vh]',
      'rounded-lg',
      'border-2',
      'border-gray-500',
      'object-cover',
    );
    imgElement.src = src;
    imgElement.alt = '';

    // Append elements to the container
    divElement.appendChild(imgElement);
    anchorElement.appendChild(divElement);
    albumContainer.appendChild(anchorElement);
  } else {
    console.error('Album container not found');
  }
}

async function updateAlbumWithNewImages(albumName) {
  try {
    const images = await genericGet(`/galleries/${albumName}`);
    console.log(images);
    const albumContainer = document.getElementById('album-container');
    albumContainer.innerHTML = '';
    images.forEach(async (image) => {
      await addToAlbumContainer(image.imageUrl, albumName);
    });
  } catch (err) {
    console.error(err);
  }
}
