
import axios from 'axios';

export const initializeRooms = ({ rooms, roomsRef }) => {
  for (const room of rooms) {
    room.notifications = 0;
    roomsRef.current[room.id] = room;
  }
  return Object.values(roomsRef.current);
};

export const initializeChannels = ({ room_id, channels, channelsRef }) => {
  for (const channel of channels) {
    channel.notifications = 0;
    channelsRef.current[channel.room_id] = channelsRef.current[channel.room_id] || {};
    channelsRef.current[channel.room_id][channel.id] = channel;
  }
  if (!channelsRef.current[room_id]) channelsRef.current[room_id] = {};
  console.log(channelsRef.current);
  return Object.values(channelsRef.current[room_id]);
};

export const initializeUsers = ({ room_id, users, usersRef, onlineUserIds }) => {
  usersRef.current[room_id] = {};
  for (const user of users) {
    usersRef.current[room_id][user.id] = user;
  }
  for (const user_id of onlineUserIds) {
    usersRef.current[room_id][user_id].online = true;
  }
  return Object.values(usersRef.current[room_id]);
};

export const initializeFriends = ({ friends, friendsRef }) => {
  for (const friend of friends) {
    friend.notifications = 0;
    friendsRef.current[friend.id] = friend;
  }
  return Object.values(friendsRef.current);
};

export const initializeRequests = ({ requests, requestsRef }) => {
  for (const request of requests) {
    requestsRef.current[request.id] = request;
  }
  return Object.values(requestsRef.current);
};

export const initializeInvites = ({ invites, invitesRef }) => {
  for (const invite of invites) {
    invitesRef.current[invite.id] = invite;
  }
  return Object.values(invitesRef.current);
};

export const getMessages = async ({ room_id, channel_id, messagesRef }) => {
  const { data } = await axios.get('/api/messages', {
    params: {
      room_id,
      channel_id
    }
  });
  messagesRef.current[room_id] = messagesRef.current[room_id] || {};
  messagesRef.current[room_id][channel_id] = data.messages;
  return messagesRef.current[room_id][channel_id].slice();
};

export const getDirectMessages = async ({ room_id, messagesRef }) => {
  if (!messagesRef.current[room_id]) {
    const { data } = await axios.get('/api/direct', {
      params: {
        room_id
      }
    });
    messagesRef.current[room_id] = data.messages;
  }
  return messagesRef.current[room_id].slice();
};

export const getUsers = async ({ room_id, usersRef, onlineUserIds }) => {
  const { data } = await axios.get('/api/get_users', {
    params: {
      room_id
    }
  });
  usersRef.current[room_id] = {};
  for (const user of data.users) {
    usersRef.current[room_id][user.id] = user;
  }
  for (const user_id of onlineUserIds) {
    usersRef.current[room_id][user_id].online = true;
  }
  return Object.values(usersRef.current[room_id]);
};

export const updateFriendsStatus = ({ friendsRef, onlineUserIds }) => {
  for (const user_id of onlineUserIds) {
    friendsRef.current[user_id].online = true;
  }
  return Object.values(friendsRef.current);
};

export const updateRoomsChannels = ({ roomsRef, roomRef, room_id, channelsRef, channelRef, channel_id }) => {
  const channels = Object.values(channelsRef.current[room_id]);
  channelRef.current = channel_id ? channelsRef.current[room_id][channel_id] : channels[0];
  const channel = channelRef.current;
  roomsRef.current[room_id].notifications -= channel.notifications;
  channel.notifications = 0;
  const rooms = Object.values(roomsRef.current);
  const room = roomRef.current = roomsRef.current[room_id];
  return { rooms, room, channels, channel };
};