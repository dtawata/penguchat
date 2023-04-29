const room = roomRef.current;

channelRef.current = channelsRef.current[room.id][channel_id];
const channel = channelRef.current;

roomsRef.current[room.id].notifications -= channel.notifications;
channel.notifications = 0;


const channels = Object.values(channelsRef.current[room_id]);
channelRef.current = channels[0];
const channel = channelRef.current;
roomsRef.current[room_id].notifications -= channel.notifications;
channel.notifications = 0;
const rooms = Object.values(roomsRef.current);
const messages = messagesRef.current[room_id][channel.id].slice();
const users = Object.values(usersRef.current[room_id]);

roomRef.current = roomsRef.current[room_id];
const room = roomRef.current;
const channels = Object.values(channelsRef.current[room.id]);
channelRef.current = channels[0];
const channel = channelRef.current;
roomsRef.current[room.id].notifications -= channel.notifications;
channel.notifications = 0;
const rooms = Object.values(roomsRef.current);