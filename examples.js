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
const request = {
  id: 5,
  requestee_id: 1,
  requester_id: 5,
  username: 'testing2',
  image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
  pending: 1
};

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

// messages
const message = {
  id: 1,
  room_id: 1,
  channel_id: 1,
  user_id: 1,
  username: 'penguin',
  image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
  created_at: '2023-05-22T22:58:36.000Z',
  content: 'lobby'
};

const direct = {
  id: 1,
  room_id: '1:3',
  user_id: 3,
  username: 'elden',
  image: '/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg',
  created_at: '2023-05-22T23:02:26.000Z',
  content: 'dude'
};

const connection = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 100
}).promise();