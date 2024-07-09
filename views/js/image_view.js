import { updateMessage } from './utils.js';
import { genericGet, initializeSocket } from './endpoints.js';

// on page load:
document.addEventListener('DOMContentLoaded', async () => {
  // establish socket connection
  const socket = await initializeSocket();
  socket.on('joinedImageRoom', (msg) => {
    console.log('successfully joined image room!');
  });
  socket.on('comment', (msg) => {
    console.log('comment received:', msg);
    // update html
    const commentContainer = document.getElementById('commentContainer');
    const commentElement = updateMessage(msg, false);
    var element = commentElement.querySelector('.top-icon.fill-main');
    console.log(element);
    //element.classList.remove('top-icon');
    commentContainer.appendChild(commentElement);
    // scroll to bottom
    commentContainer.scrollTop = commentContainer.scrollHeight;
  });
  const params = new URLSearchParams(window.location.search);
  const albumName = params.get('albumName');
  const imageUrl = params.get('src');
  console.log(albumName, imageUrl);

  const token = localStorage.getItem('token');
  const tokenParts = token.split('.');

  // The payload is the second part
  const payload = JSON.parse(atob(tokenParts[1]));
  const currUser = payload['_id'];

  const backButton = document.getElementById('back-button');

  const img = document.getElementById('image');
  img.src = imageUrl;
  const parts = imageUrl.split('/');
  const imageId = parts[parts.length - 1];
  setTimeout(() => subscribeToCommentUpdate(imageId), 1000);

  const imgResult = await genericGet(`/galleries/${albumName}/${imageId}`);
  if (imgResult) {
    if (imgResult['posterId'] === currUser) {
      document.getElementById('delete-button').removeAttribute('hidden');
    }
  } else {
    window.location.href = `./album_view.html?albumName=${albumName}&beenDeleted=true`;
  }

  backButton.addEventListener('click', () => {
    window.location.href = `./album_view.html?albumName=${albumName}`;
  });
  // get all comments
  const initial = await genericGet(`/comments/${imageId}`);
  const initialPopulate = initial.reverse();
  console.log(initial);

  // update html to display messages
  if (initial) {
    // get the html by id
    const commentContainer = document.getElementById('commentContainer');
    initial.forEach((comment) => {
      // call the update function
      const mappedComment = {
        username: comment.poster,
        message: comment.comment,
        safetyStatus: comment.safetyStatus,
        timestamp: comment.timestamp,
      };
      const commentElement = updateMessage(mappedComment, false);
      commentContainer.appendChild(commentElement);
      commentElement.scrollIntoView(false);
    });
  }

  // onDelete images
  const deleteButton = document.getElementById('delete-button');
  deleteButton.addEventListener('click', async function () {
    const imageDeleteResult = await deleteSingleImage(albumName, imageId);
    if (imageDeleteResult) {
      await deleteCommentsForImage(albumName, imageId);
    }
  });
  // hide the footer when input is sleceted
  const input = document.getElementById('comment-input');
  const footer = document.getElementById('footernav');
  const inputbar = document.getElementById('input-bar');

  input.addEventListener('focus', function () {
    footer.classList.add('hidden');
    inputbar.classList.remove('bottom-[8vh]');
    inputbar.classList.add('bottom-[0.5vh]');
  });

  input.addEventListener('blur', function () {
    footer.classList.remove('hidden');
    inputbar.classList.remove('bottom-[0.5vh]');
    inputbar.classList.add('bottom-[8vh]');
  });

  // send message when return is pressed
  input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      console.log('pressed');
      sendComment(albumName, imageId);
    }
  });
});

async function sendComment(albumName, imageId) {
  const textbox = document.getElementById('comment-input');
  const comment = textbox.value;
  console.log(comment);

  if (comment == '') {
    textbox.placeholder = 'Please enter your comment';
  } else {
    // post the message
    const new_comment = await postComment(albumName, imageId, comment);
    console.log('here is the new comment', new_comment);

    // check if message sent successfully
    if (new_comment) {
      // clear the input
      const input = document.getElementById('comment-input');
      input.value = '';
      input.blur();
    } else {
      console.log('Failed to send comment');
      textbox.placeholder = 'Failed to send comment';
    }
  }
}

async function postComment(albumName, imageId, comment) {
  const response = await fetch(`/comments/${albumName}/${imageId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  });

  const data = await response.json();

  if (response.status === 201) {
    console.log('Post successful:', data);
    return data;
  } else if (response.status === 404) {
    window.alert('Image No Longer Exist! You will be redirected');
    setTimeout(
      () => (window.location.href = `./album_view.html?albumName=${albumName}`),
      1000,
    );
  } else {
    console.error('Post failed:', data);
    return null;
  }
}

async function subscribeToCommentUpdate(imageId) {
  const response = await fetch(`/comments/${imageId}/live`, {
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

async function deleteSingleImage(albumName, imageId) {
  const response = await fetch(`/galleries/${albumName}/${imageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.status === 204) {
    return true;
    window.location.href = `./album_view.html?albumName=${albumName}&fromDelete=true`;
  } else {
    console.error('Get failed:', data);
    return null;
  }
}

async function deleteCommentsForImage(albumName, imageId) {
  const response = await fetch(`/comments/${imageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.status === 204) {
    window.location.href = `./album_view.html?albumName=${albumName}&fromDelete=true`;
  } else {
    console.error('Get failed:', data);
    return null;
  }
}
