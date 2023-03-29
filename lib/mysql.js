import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'glacier'
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

export const getPassword = async (username) => {
  const queryString = 'SELECT * FROM users WHERE username = ?';
  const queryArgs = [username];
  const data = await connection.query(queryString, queryArgs);
  return data[0][0];
};

export const getRoomMessages = async (room_id, channel_id) => {
  const queryString = 'SELECT room_messages.*, users.username, users.image FROM room_messages INNER JOIN users ON room_messages.user_id = users.id WHERE room_messages.room_id = ? AND room_messages.channel_id = ? ORDER BY id';
  const queryArgs = [room_id, channel_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};

export const getDirectMessages = async (room_id) => {
  const queryString = 'SELECT direct_messages.*, users.username, users.image FROM direct_messages INNER JOIN users ON direct_messages.user_id = users.id WHERE room_id = ? ORDER by id';
  const queryArgs = [room_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};

export const getUsersInRoom = async (room_id) => {
  const queryString = 'SELECT users.id, users.image, users.username FROM joined_rooms INNER JOIN users ON joined_rooms.user_id = users.id WHERE joined_rooms.room_id = ?';
  const queryArgs = [room_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};

// export const getRooms = async (username) => {
//   const queryString = 'SELECT * FROM joined INNER JOIN users ON WHERE username'
// };

export const addUser = async (credentials) => {
  const { email, fname, lname, username, password } = credentials;
  const queryString = 'INSERT INTO users (email, fname, lname, username, password) VALUES ?';
  const queryArgs = [[email, fname, lname, username, password]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

export const addJoinedRoom = async (user_id, room_id) => {
  const queryString = 'INSERT INTO joined_rooms (user_id, room_id) VALUES ?';
  const queryArgs = [[user_id, room_id]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};

export const getFriends = async (user_id) => {
  const queryString = 'SELECT friends.*, users.username FROM friends INNER JOIN users ON friends.other_id = users.id WHERE friends.user_id = ?';
  const queryArgs = [user_id];
  const data = await connection.query(queryString, queryArgs);
  return data[0];
};