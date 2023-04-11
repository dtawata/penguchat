const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gentoo'
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

const addRoomMessage = async ({ created_at, user_id, room_id, channel_id, content }) => {
  const queryString = 'INSERT INTO room_messages (created_at, user_id, room_id, channel_id, content) VALUES ?';
  const queryArgs = [[created_at, user_id, room_id, channel_id, content]];
  const data = await connection.query(queryString, [queryArgs]);
  return data[0];
};



// const getFriends = async (user_id) => {
//   const queryString = 'SELECT friends.room_id as id, users.username FROM friends INNER JOIN users ON friends.other_id = users.id WHERE friends.user_id = ?';
//   const queryArgs = [user_id];
//   const data = await connection.query(queryString, queryArgs);
//   return data[0];
// };



// const addDirectMessage = async ({ user_id, room_id, content }) => {
//   const queryString = 'INSERT INTO direct_messages (user_id, room_id, content) VALUES ?';
//   const queryArgs = [[user_id, room_id, content]];
//   const data = await connection.query(queryString, [queryArgs]);
//   return data[0];
// };

module.exports = {
  getRooms,
  getChannels,
  // getFriends,
  addRoomMessage,
  // addDirectMessage
};