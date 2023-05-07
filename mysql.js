const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'untitled_chat',
  // connectionLimit: 100
}).promise();

const getRooms = async (user_id) => {
  const queryString = 'SELECT rooms.* FROM rooms INNER JOIN joined_rooms ON rooms.id = joined_rooms.room_id WHERE joined_rooms.user_id = ?';
  const queryArgs = [user_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};

const getChannels = async (roomIds) => {
  const queryString = 'SELECT * FROM channels WHERE room_id IN ?';
  const queryArgs = [roomIds];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

const getFriends = async (user_id) => {
  const queryString = 'SELECT friends.room_id as id, friends.other_id as user_id, users.username, users.image FROM friends INNER JOIN users ON friends.other_id = users.id WHERE friends.user_id = ?';
  const queryArgs = [user_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};

const addRoomMessage = async ({ created_at, user_id, room_id, channel_id, content }) => {
  const queryString = 'INSERT INTO room_messages (created_at, user_id, room_id, channel_id, content) VALUES ?';
  const queryArgs = [[created_at, user_id, room_id, channel_id, content]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

const addDirectMessage = async ({ user_id, room_id, content }) => {
  const queryString = 'INSERT INTO direct_messages (user_id, room_id, content) VALUES ?';
  const queryArgs = [[user_id, room_id, content]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

const getFriendRequests = async (user_id) => {
  const queryString = 'SELECT friend_requests.*, users.username, users.image FROM friend_requests INNER JOIN users ON friend_requests.requester_id = users.id WHERE friend_requests.requestee_id = ?';
  const queryArgs = [user_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};

const getFriendRequest = async (requestee_id, requester_id) => {
  const queryString = 'SELECT friend_requests.*, users.username, users.image FROM friend_requests INNER JOIN users ON friend_requests.requester_id = users.id WHERE friend_requests.requestee_id = ? AND friend_requests.requester_id = ?';
  const queryArgs = [requestee_id, requester_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0][0];
};

const addFriend = async (user_id, other_id, room_id) => {
  const queryString = 'INSERT INTO friends (user_id, other_id, room_id) VALUES ?';
  const queryArgs = [[user_id, other_id, room_id]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

const addFriendRequest = async (requestee_id, requester_id) => {
  const queryString = 'INSERT INTO friend_requests (requestee_id, requester_id, pending) VALUES ?';
  const queryArgs = [[requestee_id, requester_id, true]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

const getUser = async (username) => {
  const queryString = 'SELECT id, email, username, fname, lname, image FROM users WHERE username = ?';
  const queryArgs = [username];
  const data = await connection.query(queryString, queryArgs);
  return data[0][0];
};

const getUserById = async (user_id) => {
  const queryString = 'SELECT id, email, username, fname, lname, image FROM users WHERE id = ?';
  const queryArgs = [user_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0][0];
};

const updateFriendRequest = async (request_id) => {
  const queryString = 'UPDATE friend_requests SET pending = 0 WHERE id = ?';
  const queryArgs = [request_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};

const addRoom = async (room_name, user_id) => {
  const queryString = 'INSERT INTO rooms (name, created_by) VALUES ?';
  const queryArgs = [[room_name, user_id]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

const addJoinedRoom = async (user_id, room_id) => {
  const queryString = 'INSERT INTO joined_rooms (user_id, room_id) VALUES ?';
  const queryArgs = [[user_id, room_id]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

const addChannel = async (name, room_id) => {
  const queryString = 'INSERT INTO channels (name, room_id) VALUES ?';
  const queryArgs = [[name, room_id]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

const addRoomInvite = async (requestee_id, requester_id, room_id, pending) => {
  const queryString = 'INSERT INTO room_invites (requestee_id, requester_id, room_id, pending) VALUES ?';
  const queryArgs = [[requestee_id, requester_id, room_id, pending]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

module.exports = {
  addChannel,
  addJoinedRoom,
  addRoom,
  getRooms,
  getUserById,
  updateFriendRequest,
  getChannels,
  getFriends,
  addFriend,
  getUser,
  addRoomMessage,
  addDirectMessage,
  addFriendRequest,
  addRoomInvite,
  getFriendRequests,
  getFriendRequest
};