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

app.use('/health', (req, res) => {
  res.status(200).send();
});

const { getRooms, getUser, addFriendRequest, getChannels, getFriends, addRoomMessage, addDirectMessage, getFriendRequests, addFriend, getFriendRequest, getUserById, updateFriendRequest, addRoom, addJoinedRoom, addChannel, addRoomInvite, getRoomInvites, updateRoomInvite, getRoomById } = require('./mysql');

io.use((socket, next) => {
  const { id, username, image } = socket.handshake.auth;
  socket.user_id = id;
  socket.username = username;
  socket.image = image;
  next();
});

io.on('connection', async (socket) => {
  socket.join(`direct:${socket.user_id}`);
  const [rooms, invites, friends, requests] = await Promise.all([getRooms(socket.user_id), getRoomInvites(socket.user_id), getFriends(socket.user_id), getFriendRequests(socket.user_id)]);
  for (const friend of friends) {
    const temp = {
      id: socket.user_id,
      username: socket.username,
      image: socket.image,
      room_id: friend.room_id,
      online: true
    };
    socket.to(`direct:${friend.id}`).emit('to:client:update_friends', { friend: temp });
    socket.join(friend.room_id);
  }
  if (rooms.length) {
    const roomIds = [];
    const user = {
      id: socket.user_id,
      username: socket.username,
      image: socket.image,
      online: true,
    };
    for (const room of rooms) {
      socket.to(room.id).emit('to:client:update_users', { room_id: room.id, user });
      socket.join(room.id);
      roomIds.push(room.id);
    }
    const room = rooms[0];
    const channels = await getChannels(roomIds);
    const onlineUsers = await io.in(room.id).fetchSockets();
    const onlineUserIds = [];
    for (const onlineUser of onlineUsers) {
      onlineUserIds.push(onlineUser.user_id);
    }
    socket.emit('to:client:initialize', {
      wsRooms: rooms,
      wsChannels: channels,
      wsInvites: invites,
      wsFriends: friends,
      wsRequests: requests,
      onlineUserIds
    });
  } else {
    socket.emit('to:client:initialize', {
      wsRooms: rooms,
      wsChannels: [],
      wsInvites: invites,
      wsFriends: friends,
      wsRequests: requests,
      onlineUserIds: []
    });
  }




  // Checked START
  socket.on('to:server:change_direct', async (friends) => {
    const onlineUserIds = [];
    for (const friend of friends) {
      const sockets = await io.in(`direct:${friend.id}`).fetchSockets();
      if (sockets.length) onlineUserIds.push(sockets[0].user_id);
    }
    socket.emit('to:client:change_direct', { onlineUserIds });
  });

  socket.on('to:server:change_direct2', async ({ friends, requests, invites }) => {
    const onlineUserIds = [];
    for (const friend of friends) {
      const sockets = await io.in(`direct:${friend.id}`).fetchSockets();
      if (sockets.length) onlineUserIds.push(sockets[0].user_id);
    }
    socket.emit('to:client:change_direct2', { requests, invites, onlineUserIds });
  });
  // Checked END






  socket.on('to:server:respond_room_invite', async ({ myUser, invite, status }) => {
    if (status) {
      await Promise.all([addJoinedRoom({
        user_id: socket.user_id,
        room_id: invite.room_id
      }), updateRoomInvite(invite.id)]);
      socket.join(invite.room_id);
      socket.to(invite.room_id).emit('to:client:respond_room_invite', { room_id: invite.room_id, user: myUser });

      const room = await getRoomById(invite.room_id);
      const [channels, onlineUsers] = await Promise.all([getChannels([room.id]), io.in(room.id).fetchSockets()]);
      const onlineUserIds = [];
      for (const onlineUser of onlineUsers) {
        onlineUserIds.push(onlineUser.user_id);
      }
      socket.emit('to:client:joined_room', { wsRoom: room, wsChannels: channels, onlineUserIds });
    }
    await updateRoomInvite(invite.id);
    socket.emit('to:client:update_room_invite', invite.id);
  });

  socket.on('to:server:create_room', async ({ myUser, room_name }) => {
    const { insertId } = await addRoom(room_name, myUser.id);
    await addJoinedRoom({ user_id: myUser.id, room_id: insertId });
    const room = {
      id: insertId,
      name: room_name,
      image: 'default.jpg',
      created_by: myUser.id
    }
    const temp = await addChannel('lobby', insertId);
    const channel = {
      id: temp.insertId,
      name: 'lobby',
      room_id: insertId
    };
    socket.join(insertId);
    socket.emit('to:client:create_room', { wsRoom: room, wsChannel: channel });
  });




  socket.on('to:server:room:send_message', async (message) => {
    message.created_at = new Date();
    const { insertId } = await addRoomMessage(message);
    message.id = insertId;
    io.to(message.room_id).emit('to:client:room:receive_message', { message });
  });

  socket.on('to:server:direct:send_message', async (message) => {
    message.created_at = new Date();
    const { insertId } = await addDirectMessage(message);
    message.id = insertId;
    io.to(message.room_id).emit('to:client:direct:receive_message', { message });
  });

  socket.on('to:server:change_room', async (room_id) => {
    const onlineUsers = await io.in(room_id).fetchSockets();
    const onlineUserIds = [];
    for (const onlineUser of onlineUsers) {
      onlineUserIds.push(onlineUser.user_id);
    }
    socket.emit('to:client:change_room', { room_id, onlineUserIds });
  });

  socket.on('to:server:send_friend_request', async ({ username, requester }) => {
    const user = await getUser(username);
    const { insertId } = await addFriendRequest(user.id, requester.id);
    const request = {
      id: insertId,
      requestee_id: user.id,
      requester_id: requester.id,
      pending: 1,
      username: requester.username,
      image: requester.image,
    };
    socket.to(`direct:${user.id}`).emit('to:client:send_friend_request', request);
  });

  socket.on('to:server:respond_friend_request', async ({ request, status }) => {
    if (status) {
      const room_id = `${Math.min(request.requestee_id, request.requester_id)}:${Math.max(request.requestee_id, request.requester_id)}`;
      await Promise.all([addFriend(request.requestee_id, request.requester_id, room_id), addFriend(request.requester_id, request.requestee_id, room_id), updateFriendRequest(request.id)]);
      socket.join(room_id);
      const sockets = await io.in(`direct:${request.requester_id}`).fetchSockets();
      if (sockets.length) sockets[0].join(room_id);
      const requester = {
        id: request.requester_id,
        username: request.username,
        image: request.image,
        room_id,
        online: !!sockets.length
      };
      const requestee = {
        id: socket.user_id,
        username: socket.username,
        image: socket.image,
        room_id,
        online: true,
      };
      socket.to(`direct:${requester.id}`).emit('to:client:receive_friend_response', { friend: requestee, request });
      socket.emit('to:client:receive_friend_response', { friend: requester, request });
    } else {
      await updateFriendRequest(request.id);
    }
  });

  socket.on('to:server:send_room_invite', async ({ room, requester, username }) => {
    const requestee = await getUser(username);
    const { insertId } = await addRoomInvite({
      requestee_id: requestee.id,
      requester_id: requester.id,
      room_id: room.id,

      pending: 1
    });
    const invite = {
      id: insertId,
      requestee_id: requestee.id,
      requester_id: requester.id,
      requester_username: requester.username,
      room_id: room.id,
      room_name: room.name,
      room_image: room.image,
      pending: 1
    };
    socket.to(`direct:${requestee.id}`).emit('to:client:receive_room_invite', invite);
  });

  socket.on('to:server:create_channel', async ({ room_id, channel_name }) => {
    const { insertId } = await addChannel(channel_name, room_id);
    const channel = {
      id: insertId,
      name: channel_name,
      room_id
    }
    io.to(room_id).emit('to:client:create_channel', channel);
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
        socket.to(room_id).emit('to:client:update_users', { user, room_id });
      } else {
        const friend = {
          id: socket.user_id,
          username: socket.username,
          image: socket.image,
          room_id,
          online: false
        };
        socket.to(room_id).emit('to:client:update_friends', { friend });
      }
    });
  });
});

const port = 3010;
server.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
});