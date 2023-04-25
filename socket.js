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

const { getRooms, getUser, addFriendRequest, getChannels, getFriends, addRoomMessage, addDirectMessage, getFriendRequests, addFriend, getFriendRequest, getUserById, updateFriendRequest } = require('./mysql');

io.use((socket, next) => {
  const { id, username, image } = socket.handshake.auth;
  socket.user_id = id;
  socket.username = username;
  socket.image = image;
  next();
});

io.on('connection', async (socket) => {
  socket.join(`direct:${socket.user_id}`);
  const [rooms, friends] = await Promise.all([getRooms(socket.user_id), getFriends(socket.user_id)]);
  for (const friend of friends) {
    socket.to(`direct:${friend.user_id}`).emit('to:client:update_friends', { wsFriendId: friend.id, wsStatus: true });
    socket.join(friend.id);
  }
  const roomIds = [];
  const user = {
    id: socket.user_id,
    username: socket.username,
    image: socket.image,
    online: true,
  };
  for (const room of rooms) {
    // socket.to(room.id).emit('to:client:update_users', { wsUserId: socket.user_id, wsRoomId: room.id, wsStatus: true });
    socket.to(room.id).emit('to:client:update_users', { wsUser: user, wsRoomId: room.id });
    socket.join(room.id);
    roomIds.push(room.id);
  }
  const room = rooms[0];
  const channels = await getChannels(roomIds);
  const sockets = await io.in(room.id).fetchSockets();
  const userIds = [];
  for (const user of sockets) {
    userIds.push(user.user_id);
  }
  const requests = await getFriendRequests(socket.user_id);
  socket.emit('to:client:initialize', { wsRooms: rooms, wsChannels: channels, wsFriends: friends, wsUserIds: userIds, wsRequests: requests });


  socket.on('to:server:change_direct', async (friends) => {
    for (const friend of friends) {
      const sockets = await io.in(`direct:${friend.user_id}`).fetchSockets();
      friend.online = !!sockets.length;
    }
    socket.emit('to:client:change_direct', { wsFriends: friends });
  });

  socket.on('to:server:room:send_message', async (message) => {
    message.created_at = new Date();
    const { insertId } = await addRoomMessage(message);
    message.id = insertId;
    io.to(message.room_id).emit('to:client:room:receive_message', { wsMessage: message });
  });

  socket.on('to:server:direct:send_message', async (message) => {
    message.created_at = new Date();
    const { insertId } = await addDirectMessage(message);
    message.id = insertId;
    io.to(message.room_id).emit('to:client:direct:receive_message', { wsMessage: message });
  });

  socket.on('to:server:change_room', async (room_id) => {
    const sockets = await io.in(room_id).fetchSockets();
    const userIds = [];
    for (const user of sockets) {
      userIds.push(user.user_id);
    }
    socket.emit('to:client:change_room', { wsRoomId: room_id, wsUsersIds: userIds });
  });

  socket.on('to:server:send_friend_request', async ({ username, requester }) => {
    const user = await getUser(username);
    const { insertId } = await addFriendRequest(user.id, requester.id);
    const request = {
      id: insertId,
      user_id: user.id,
      other_id: requester.id,
      pending: 1,
      username: requester.username,
      image: requester.image,
    };
    socket.to(`direct:${user.id}`).emit('to:client:send_friend_request', request);
  });
  ///


  socket.on('to:server:send_friend_request_response', async ({ request, status }) => {
    if (status) {
      const room_id = `${Math.min(request.requestee_id, request.requester_id)}:${Math.max(request.requestee_id, request.requester_id)}`;
      await Promise.all([addFriend(request.requestee_id, request.requester_id, room_id), addFriend(request.requester_id, request.requestee_id, room_id), updateFriendRequest(request.id)]);
      const sockets = await io.in(`direct:${request.requester_id}`).fetchSockets();
      const requester = {
        id: request.requester_id,
        username: request.username,
        image: request.image,
        online: !!sockets.length
      };
      const requestee = {
        id: socket.user_id,
        username: socket.username,
        image: socket.image,
        online: true,
      };
      socket.to(`direct:${requester.id}`).emit('to:client:receive_friend_request_response', { wsFriend: requestee, wsRequest: request });
      socket.emit('to:client:receive_friend_request_response', { wsFriend: requester, wsRequest: request });
    } else {
      await updateFriendRequest(request.id);
    }
  });

  socket.on('disconnecting', () => {
    const roomIds = [...socket.rooms.values()];
    const user = {
      id: socket.user_id,
      username: socket.username,
      image: socket.image,
      online: false,
    };
    roomIds.forEach((room_id) => {
      if (Number(room_id)) {
        socket.to(room_id).emit('to:client:update_users', { wsUser: user, wsRoomId: room_id });
      } else {
        socket.to(room_id).emit('to:client:update_friends', { wsFriendId: room_id, wsStatus: false });
      }
    });
  });
});

const port = 3003;
server.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
});