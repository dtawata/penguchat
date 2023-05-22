// rooms
const room = {
  id: 1,
  created_by: 1,
  name: 'Anime Time',
  image: '/img/default.jpg',
  notifications: 0
};

// channels
const channel = {
  id: 1,
  name: 'lobby',
  room_id: 1,
  notifications: 0
};

// users
const user = {
  id: 1,
  username: 'ironcladdaniel',
  image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
  online: true
}

// friends
const friend = {
  id: '2:3',
  user_id: 3,
  username: 'incognito',
  image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
  notifications: 0
}


// requests


// invites
const invite = {
  id: 3,
  requestee_id: 1,
  requester_id: 2,
  requester_username: 'safari',
  room_id: 2,
  room_name: 'testing',
  room_image: '/img/default.jpg',
  pending: 1
};