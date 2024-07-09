// join incident endpoint
import { showPopup } from './utils.js';

export async function updateSentiment(incidentId, messageId, sentimentBody) {
  try {
    const response = await fetch(
      `/chatRooms/groups/${incidentId}/messages/${messageId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sentimentBody),
      },
    );

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error('Failed to fetch announcement:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// leave incident endpoint
export async function leaveIncident(incidentId) {
  try {
    const response = await fetch(`/incidents/${incidentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error('Failed to leave incident:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// join incident endpoint
export async function joinIncident(incidentId) {
  try {
    const response = await fetch(`/incidents/${incidentId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error('Failed to fetch announcement:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// create incidents endpoint
export async function createIncident(name, event, longitude, latitude) {
  try {
    const response = await fetch(`/incidents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, event, longitude, latitude }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error('Failed to fetch announcement:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// create album endpoint
export async function createAblum(shelter) {
  try {
    const response = await fetch(`/galleries/new/${shelter}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error('Failed to create ablum:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// fetch incidents endpoint
export async function getIncidents(page = 1, ascending = false) {
  const queryParams = `?page=${page}&ascending=${ascending}`;
  return await genericGet(`/incidents${queryParams}`);
}

// fetch incident using incident id
export async function getIncident(incidentId) {
  return await genericGet(`/incidents/${incidentId}`);
}

// fetch announcement endpoint
export async function getAnnounce(page = 1, ascending = true) {
  const queryParams = `?page=${page}&ascending=${ascending}`;
  return await genericGet(`/announcements${queryParams}`);
}

// post message endpoint
export async function postGroupMessage(incidentId, message) {
  const response = await fetch(`/chatRooms/groups/${incidentId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  const data = await response.json();

  if (response.status === 201) {
    console.log('Post successful:', data);
    return data;
  } else {
    console.error('Post failed:', data);
    return null;
  }
}

// fetch message endpoint
export async function getGroupMessages(incidentId, page = 1, ascending = true) {
  const queryParams = `?page=${page}&ascending=${ascending}`;
  return await genericGet(`/chatRooms/groups/${incidentId}${queryParams}`);
}

// fetch message endpoint
export async function getGroupMessage(incidentId, messageId) {
  return await genericGet(
    `/chatRooms/groups/${incidentId}/messages/${messageId}`,
  );
}

// post announcement endpoint
export async function postAnnounce(message) {
  const response = await fetch('/announcements', {
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
    return data;
  } else {
    console.error('Post failed:', data);
    return null;
  }
}

// fetch message endpoint
export async function getMessage(page = 1, ascending = true) {
  const queryParams = `?page=${page}&ascending=${ascending}`;
  return await genericGet(`/chatRooms/public${queryParams}`);
}

// post message endpoint
export async function postMessage(message) {
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
    return data;
  } else {
    console.error('Post failed:', data);
    return null;
  }
}

// fetch message endpoint
export async function getPrivateMessages(username) {
  const queryParams = `?participantId=${username}`;
  return await genericGet(`/chatRooms/private${queryParams}`);
}

// post message endpoint
export async function postPrivateMessage(message, receiverId) {
  const response = await fetch('/chatRooms/private', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, receiverId }),
  });

  const data = await response.json();

  if (response.status === 201) {
    console.log('Post successful:', data);
    return data;
  } else {
    console.error('Post failed:', data);
    return null;
  }
}

// update read unread endpoint
export async function readMessage(participantId) {
  const response = await fetch('/chatRooms/private/readStatus', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ participantId }),
  });

  if (response.status === 200) {
    console.log('read successful:');
  } else {
    console.error('read failed:');
  }
}

// fetch userlist endpoint
export async function getUsers() {
  return await genericGet('/chatRooms/private/participants');
}

// fetch new messages endpoint
export async function getNewMessages() {
  return await genericGet('/chatRooms/private/newMessages');
}

// fetch userlist endpoint
export async function getAllUsers(
  page = 1,
  size = 200,
  ascending = true,
  username = '',
) {
  const queryParams = `?page=${page}&pageSize=${size}&ascending=${ascending}&name=${username}`;

  return await genericGet(`/users${queryParams}`);
}

// valide info endpoint
export async function validateInfo(username, password, type, id) {
  const response = await fetch(`/users/changes/validation/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, type }),
  });

  const data = await response.json();
  console.log(data);

  if (response.status === 200) {
    console.log('validation successful:', data);
    return 'validtion successful';
  } else {
    return data.message;
  }
}

// modify user info
export async function modifyInfo(username, password, type, isActive, id) {
  let payload = {};
  if (password === '') {
    payload = { username, type, isActive };
  } else {
    payload = { username, password, type, isActive };
  }
  console.log(localStorage.getItem('token'));
  const response = await fetch(`/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 204) {
    return 'modify successful';
  } else {
    const data = await response.json();
    console.error('ack failed:', data.message);
  }
}

export async function acknowledge() {
  console.log(localStorage.getItem('token'));
  const response = await fetch('/auth/acknowledgement', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ acknowledged: true }),
  });

  if (response.status === 204) {
    console.log('ack successful:');
  } else {
    const data = await response.json();
    console.error('ack failed:', data.message);
  }
}

// fetch shelter endpoint
export async function getShelter(
  page = 1,
  size = 200,
  ascending = true,
  shelter = '',
) {
  const queryParams = `?page=${page}&pageSize=${size}&ascending=${ascending}&name=${shelter}`;
  return await genericGet(`/shelters${queryParams}`);
}

// update shelter endpoint
export async function updateShelter(name, capacity) {
  console.log(localStorage.getItem('token'));
  const response = await fetch('/shelters', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name, capacity }),
  });

  if (response.status === 204) {
    console.log('ack successful:');
  } else {
    const data = await response.json();
    console.error('ack failed:', data.message);
  }
}

// post shelter endpoint
export async function postShelter(
  name,
  address,
  capacity,
  longitude,
  latitude,
) {
  const response = await fetch('/shelters', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, address, capacity, longitude, latitude }),
  });

  const data = await response.json();

  if (response.status === 201) {
    console.log('Post successful:', data);
    return data;
  } else {
    console.error('Post failed:', data);
    return null;
  }
}

// delete shelter endpoint
// post shelter endpoint
export async function deleteShelter(name) {
  const response = await fetch('/shelters', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (response.status === 204) {
    console.log('delete successful:');
  } else {
    console.error('delete failed:');
  }
}

export async function getShelterRatingList(
  filterName,
  min,
  max,
  sortBy,
  ascending,
) {
  const queryParams = `?filterName=${filterName}&min=${min}&max=${max}&sortBy=${sortBy}&ascending=${ascending}`;

  return await genericGet(`/shelterReviews/shelters${queryParams}`);
}

export async function submitReview(ratings, message, location) {
  console.log('submitting a review');
  console.log(ratings);
  console.log(message);
  console.log(location);
  try {
    const response = await fetch(`/shelterReviews`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ratings: ratings,
        message: message,
        location: location,
      }),
    });

    const data = await response.json();

    if (response.status === 201) {
      return data;
    } else {
      console.error('Failed to post new review: ', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getThisShelterRatings(location) {
  return await genericGet(`/shelterReviews/ratings?location=${location}`);
}

export async function getThisShelterReviews(location) {
  return await genericGet(`/shelterReviews/messages?location=${location}`);
}

export async function updateThisReview(id, message) {
  try {
    const response = await fetch(`/shelterReviews`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        message: message,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error('Failed to fetch reviews ', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function deleteThisReview(reviewer, id) {
  try {
    const response = await fetch(`/shelterReviews`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        reviewer: reviewer,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data;
    } else {
      console.error('Failed to delete review ', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function genericGet(path) {
  try {
    const response = await fetch(path, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log('Get successful:', data);
      return data;
    } else {
      console.error('Get failed:', data);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function initializeSocket() {
  let ENDPOINT;
  if (window.location.hostname === 'localhost') {
    ENDPOINT = 'http://localhost:3000';
  } else {
    ENDPOINT = 'https://s24esnb5.onrender.com';
  }
  console.log('ENDPOINT set: ', ENDPOINT);
  const socket = io(ENDPOINT, {
    origin: window.location.hostname,
    auth: {
      token: localStorage.getItem('token'),
    },
    transports: ['websocket'],
  });
  socket.on('connect_error', (err) => {
    console.log(err.message);
    window.location.href = './register_page.html';
  });
  return socket;
}

export async function subscribeToPrivateAndTesting(socket) {
  socket.on('private', (msg) => {
    console.log('private message received:', msg);
    // check if the sender is the current one
    showPopup(msg.sender);
  });

  // check if test start
  socket.on('testing', (msg) => {
    console.log('test start:', msg);
    // check if the sender is the current one
    window.location.href = './pause_page.html';
  });
  return socket;
}
