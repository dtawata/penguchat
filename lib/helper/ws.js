  export const wsChangeRoom = async ({ room_id, userIds }) => {
    const [rooms, room, channels, channel] = updateChannels(roomsRef, roomRef, channelsRef, channelRef, room_id);
    const { data } = await axios.get('/api/initialize', {
      params: {
        room_id: room.id,
        channel_id: channel.id
      }
    });
    messagesRef.current[room.id] = {};
    messagesRef.current[room.id][channel.id] = data.messages;

    const messages = messagesRef.current[room.id][channel.id].slice();
    const users = initializeUsers(data.users, usersRef, userIds, room_id);

    // usersRef.current[room.id] = {};
    // for (const user of data.users) {
    //   usersRef.current[room.id][user.id] = user;
    // }
    // for (const user_id of userIds) {
    //   usersRef.current[room.id][user_id].online = true;
    // }
    // const users = Object.values(usersRef.current[room.id]);
    view.current = 'room';
    dispatch({
      type: 'change_room',
      payload: {
        view: view.current,
        rooms,
        room,
        channels,
        channel,
        messages,
        users
      }
    });
  };