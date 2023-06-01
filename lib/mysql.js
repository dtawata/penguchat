require('dotenv').config();
const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '',
//   database: 'chat'
// }).promise();

const connection = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 100
}).promise();

export const getUsers = async () => {
  const queryString = 'SELECT * FROM users';
  const users = await connection.query(queryString);

  return users[0];
};

export const getUser = async (username) => {
  const queryString = 'SELECT id, email, username, fname, lname, image FROM users WHERE username = ?';
  const queryArgs = [username];
  const data = await connection.query(queryString, queryArgs);

  return data[0][0];
};


export const getDirectMessages = async (room_id) => {
  const queryString = 'SELECT direct_messages.*, users.username, users.image FROM direct_messages INNER JOIN users ON direct_messages.user_id = users.id WHERE room_id = ? ORDER by id';
  const queryArgs = [room_id];
  const data = await connection.query(queryString, queryArgs);

  return data[0];
};


// export const getRooms = async (username) => {
//   const queryString = 'SELECT * FROM joined INNER JOIN users ON WHERE username'
// };

// used in /api/auth/[...nextauth]
export const getPassword = async (username) => {
  const queryString = 'SELECT * FROM users WHERE username = ?';
  const queryArgs = [username];
  const data = await connection.query(queryString, queryArgs);

  return data[0][0];
};

// used in /api/auth/register
export const addUser = async (credentials) => {
  const { email, fname, lname, username, password } = credentials;
  const queryString = 'INSERT INTO users (email, fname, lname, username, password) VALUES ?';
  const queryArgs = [[email, fname, lname, username, password]];
  const data = await connection.query(queryString, [queryArgs]);

  return data[0];
};

// used in /api/register
export const addJoinedRoom = async (user_id, room_id) => {
  const queryString = 'INSERT INTO joined_rooms (user_id, room_id) VALUES ?';
  const queryArgs = [[user_id, room_id]];
  const data = await connection.query(queryString, [queryArgs]);

  return data[0];
};

// used in /api/rooms, called from index.js
export const getRooms = async (user_id) => {
  const queryString = 'SELECT rooms.* FROM rooms INNER JOIN joined_rooms ON rooms.id = joined_rooms.room_id WHERE joined_rooms.user_id = ?';
  const queryArgs = [user_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};

// used in /api/messages, called from index.js
export const getRoomMessages = async (room_id, channel_id) => {
  const queryString = 'SELECT room_messages.*, users.username, users.image FROM room_messages INNER JOIN users ON room_messages.user_id = users.id WHERE room_messages.room_id = ? AND room_messages.channel_id = ? ORDER BY id';
  const queryArgs = [room_id, channel_id];
  const data = await connection.query(queryString, queryArgs);

  return data[0];
};

// used in /api/messages, called from index.js
export const getUsersInRoom = async (room_id) => {
  const queryString = 'SELECT users.id, users.image, users.username FROM joined_rooms INNER JOIN users ON joined_rooms.user_id = users.id WHERE joined_rooms.room_id = ?';
  const queryArgs = [room_id];
  const data = await connection.query(queryString, queryArgs);

  return data[0];
};


export const addFriends = async (user_id, other_id, room_id) => {
  const queryString = 'INSERT INTO friends (user_id, other_id, room_id) VALUES ?';
  const queryArgs = [[user_id, other_id, room_id]];
  const data = await connection.query(queryString, [queryArgs]);

  return data[0];
};

export const addFriendRequest = async (requestee_id, requester_id) => {
  const queryString = 'INSERT INTO friend_requests (user_id, requester_id, pending) VALUES ?';
  const queryArgs = [[requestee_id, requester_id, true]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

export const addRoom = async (room_name, user_id) => {
  const queryString = 'INSERT INTO rooms (name, created_by) VALUES ?';
  const queryArgs = [[room_name, user_id]];
  const data = await connection.query(queryString, [queryArgs]);

  return data[0];
};
