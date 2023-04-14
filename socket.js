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
  const user = {
    id: socket.user_id,
    username: socket.username,
    room_id: null,
    onlline: true
  };
  for (const room of rooms) {
    user.room_id = room.id;
    socket.to(room.id).emit('to:client:update_users', { wsStatus: true, wsUser: user });
    socket.join(room.id);
    roomIds.push(room.id);
  }
  const channels = await getChannels(roomIds);
  const sockets = await io.in(roomIds[0]).fetchSockets();
  const users = [];
  for (const user of sockets) {
    users.push({
      id: user.user_id,
      username: user.username,
      room_id: roomIds[0]
    });
  }
  socket.emit('to:client:initialize', { wsRooms: rooms, wsChannels: channels, wsUsers: users });

  socket.on('to:server:send_message', async (message) => {
    message.created_at = new Date();
    const { insertId } = await addRoomMessage(message);
    message.id = insertId;
    io.emit('to:client:receive_message', message);
  });

  socket.on('to:server:change_room', async (room) => {
    const sockets = await io.in(room.id).fetchSockets();
    const users = [];
    for (const user of sockets) {
      users.push({
        id: user.user_id,
        username: user.username,
        room_id: room.id
      });
    }
    socket.emit('to:client:change_room', { wsRoom: room, wsUsers: users });
  });

  socket.on('disconnecting', () => {
    const roomIds = [...socket.rooms.values()];
    roomIds.forEach((room_id) => {
      const user = {
        id: socket.user_id,
        username: socket.username,
        room_id
      };
      io.to(room_id).emit('to:client:update_users', { wsStatus: false, wsUser: user });
    });
  });

});

const port = 3003;
server.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
});