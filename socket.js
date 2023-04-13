const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: true
  }
});

const { getRooms, getChannels, addRoomMessage } = require('./mysql');
// getFriends, , addDirectMessage

io.use((socket, next) => {
  const { id, username } = socket.handshake.auth;
  socket.user_id = id;
  socket.username = username;
  next();
});

io.on('connection', async (socket) => {
  const rooms = await getRooms(socket.user_id);
  const roomIds = [];
  for (const room of rooms) {
    socket.join(room.id);
    roomIds.push(room.id);
  }
  const channels = await getChannels(roomIds);

  const onlineUsers = await io.in(roomIds[0]).fetchSockets();
  const users = [];
  for (const onlineUser of onlineUsers) {
    users.push({
      id: onlineUser.user_id,
      username: onlineUser.username,
      room_id: roomIds[0]
    });
  }

  socket.emit('initialize', { rooms, channels, users });

  socket.on('send_message', async (message) => {
    message.created_at = new Date();
    await addRoomMessage(message);
    io.emit('receive_message', message);
  });

  socket.on('request_users', async (room) => {
    const sockets = await io.in(room.id).fetchSockets();
    const users = [];
    for (const user of sockets) {
      users.push({
        id: user.user_id,
        username: user.username,
        room_id: room.id
      });
    }
    socket.emit('change_room', { room, users });
  });

});

const port = 3003;
server.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
});