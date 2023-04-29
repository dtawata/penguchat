import { useState, useRef, useEffect, useReducer } from 'react';
import axios from 'axios';
import initializeFriends from '../helper/helper';

const reducer = (state, action) => {
  const { view, rooms, room, channels, channel, friends, messages, users, requests, modal } = action.payload;
  switch (action.type) {
    case 'initialize': {
      return {
        ...state,
        view,
        rooms,
        room,
        channels,
        friends,
        messages,
        users,
        requests
      };
    }
    case 'change_direct': {
      return {
        ...state,
        view,
        messages
      };
    }
    case 'change_friend': {
      return {
        ...state,
        friends,
        messages
      };
    }
    case 'change_room': {
      return {
        ...state,
        view,
        rooms,
        room,
        channels,
        channel,
        messages,
        users
      };
    }
    case 'change_channel': {
      return {
        ...state,
        rooms,
        channels,
        messages
      };
    }
    case 'receive_room_message': {
      return {
        ...state,
        messages
      };
    }
    case 'update_users': {
      return {
        ...state,
        users
      };
    }
    case 'update_notifications_r': {
      return {
        ...state,
        rooms
      };
    }
    case 'update_notifications_rc': {
      return {
        ...state,
        rooms,
        channels
      };
    }
    case 'receive_direct_message': {
      return {
        ...state,
        messages
      };
    }
    case 'update_friends': {
      return {
        ...state,
        friends
      };
    }
    case 'change_direct_f': {
      return {
        ...state,
        view,
        friends
      };
    }
    case 'receive_friend_request': {
      return {
        ...state,
        requests
      };
    }
    case 'receive_friend_request_response': {
      return {
        ...state,
        friends,
        requests
      };
    }
    case 'update_modal': {
      return {
        ...state,
        modal
      };
    }
    case 'update_friends': {
      return {
        ...state,
        friends
      };
    }
    case 'change_default': {
      return {
        ...state,
        friends
      };
    }
    default: {
      return state;
    }
  }
};

const useSave = (initialValue, socket) => {
  const view = useRef('room');
  const roomsRef = useRef({});
  const roomRef = useRef({});
  const channelsRef = useRef({});
  const channelRef = useRef({});
  const directRef = useRef({ notifications: 0 });
  const friendsRef = useRef({});
  const friendRef = useRef({});
  const messagesRef = useRef({});
  const usersRef = useRef({});
  const requestsRef = useRef({});

  const [state, dispatch] = useReducer(reducer, initialValue);

  const updateValue = async ({ rooms, wsChannels, friends: wsFriends, userIds, requests }) => {
    const friends = initializeFriends(wsFriends, friendsRef);
    console.log('ref', friendsRef.current);
    // for (const friend of friends) {
    //   friendsRef.current[friend.id] = friend;
    //   friend.notifications = 0;
    // }
    friendRef.current = { id: 'default' };

    for (const room of rooms) {
      roomsRef.current[room.id] = room;
      room.notifications = 0;
    }
    roomRef.current = rooms[0];
    const room = roomRef.current;

    for (const channel of wsChannels) {
      channelsRef.current[channel.room_id] = channelsRef.current[channel.room_id] || {};
      channelsRef.current[channel.room_id][channel.id] = channel;
      channel.notifications = 0;
    }
    const channels = Object.values(channelsRef.current[room.id]);
    channelRef.current = channels[0];
    const channel = channelRef.current;

    const { data } = await axios.get('/api/initialize', {
      params: {
        room_id: room.id,
        channel_id: channel.id
      }
    });
    messagesRef.current[room.id] = {};
    messagesRef.current[room.id][channel.id] = data.messages;
    const messages = messagesRef.current[room.id][channel.id].slice();

    usersRef.current[room.id] = {};
    for (const user of data.users) {
      usersRef.current[room.id][user.id] = user;
    }
    for (const user_id of userIds) {
      usersRef.current[room.id][user_id].online = true;
    }
    const users = Object.values(usersRef.current[room.id]);
    view.current = 'room';

    dispatch({
      type: 'initialize',
      payload: {
        view: view.current,
        rooms,
        room,
        channels,
        channel,
        friends,
        messages,
        users,
        requests
      }
    });
  };



  console.log('use save rendering');
  return [state, updateValue, changeChannel, wsChangeDirect, changeRoom, wsChangeRoom, wsReceiveRoomMessage, wsReceiveDirectMessage, wsReceiveFriendRequest, wsReceiveFriendRequestResponse, wsUpdateUsers, wsUpdateFriends, changeDirect, changeFriend];
};

export default useSave;