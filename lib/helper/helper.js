
import axios from 'axios';

export const getMessages = async ({ messagesRef, room_id, channel_id }) => {
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

export const getDirectMessages = async ({ messagesRef, friend_id }) => {
  if (!messagesRef.current[friend_id]) {
    const { data } = await axios.get('/api/direct', {
      params: {
        friend_id
      }
    });
    messagesRef.current[friend_id] = data.messages;
  }
  return messagesRef.current[friend_id].slice();
};


export const getUsers = async ({ room_id, usersRef, userIds }) => {
  const { data } = await axios.get('/api/get_users', {
    params: {
      room_id
    }
  });

  usersRef.current[room_id] = {};

  for (const user of data.users) {
    usersRef.current[room_id][user.id] = user;
  }

  for (const user_id of userIds) {
    usersRef.current[room_id][user_id].online = true;
  }

  return Object.values(usersRef.current[room_id]);
};

export const initializeFriends = (friends, friendsRef) => {
  for (const friend of friends) {
    friend.notifications = 0;
    friendsRef.current[friend.id] = friend;
  }
  return Object.values(friendsRef.current);
};

export const updateFriendsStatus = (friends, friendsRef) => {
  for (const friend of friends) {
    friend.notifications = 0;
    friendsRef.current[friend.id] = friend;
  }
  return Object.values(friendsRef.current);
};


export const initializeRooms = (rooms, roomsRef) => {
  for (const room of rooms) {
    room.notifications = 0;
    roomsRef.current[room.id] = room;
  }
  return Object.values(roomsRef.current);
};

export const initializeChannels = (channels, channelsRef, room_id) => {
  for (const channel of channels) {
    channel.notifications = 0;
    channelsRef.current[channel.room_id] = channelsRef.current[channel.room_id] || {};
    channelsRef.current[channel.room_id][channel.id] = channel;
  }
  if (!channelsRef.current[room_id]) channelsRef.current[room_id] = {};
  console.log(channelsRef.current);
  return Object.values(channelsRef.current[room_id]);
};

export const initializeUsers = (users, usersRef, userIds, room_id) => {
  usersRef.current[room_id] = {};

  for (const user of users) {
    usersRef.current[room_id][user.id] = user;
  }

  for (const user_id of userIds) {
    usersRef.current[room_id][user_id].online = true;
  }

  return Object.values(usersRef.current[room_id]);

};

// usersRef.current[room.id] = {};
// for (const user of data.users) {
//   usersRef.current[room.id][user.id] = user;
// }
// for (const user_id of userIds) {
//   usersRef.current[room.id][user_id].online = true;
// }
// const users = Object.values(usersRef.current[room.id]);


export const updateRoomsChannels = ({ roomsRef, roomRef, room_id, channelsRef, channelRef, channel_id }) => {
  console.log('update', channelsRef.current);
  const channels = Object.values(channelsRef.current[room_id]);
  channelRef.current = channel_id ? channelsRef.current[room_id][channel_id] : channels[0];
  const channel = channelRef.current;
  roomsRef.current[room_id].notifications -= channel.notifications;
  channel.notifications = 0;
  const rooms = Object.values(roomsRef.current);
  const room = roomRef.current = roomsRef.current[room_id];
  return { rooms, room, channels, channel };
};


// const channels = Object.values(channelsRef.current[room.id]);
// const channel = channelRef.current = channelsRef.current[room.id][channel_id];

// roomsRef.current[room.id].notifications -= channel.notifications;
// channel.notifications = 0;
// const rooms = Object.values(roomsRef.current);
// const room = roomRef.current;

// export default initializeFriends;