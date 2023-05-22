import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect, useReducer } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { getUser } from '../lib/mysql';
import { io } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import Room from '@/components/room/Room';
import Direct from '@/components/direct/Direct';
import Modal from '@/components/modal/Modal';

import { initializeFriends, getDirectMessages, initializeRooms, initializeChannels, updateFriendsStatus, updateRoomsChannels, getMessages, getUsers, initializeRequests, initializeInvites, initializeUsers } from '@/lib/helper/helper';

const reducer = (state, action) => {
  const { view, direct, rooms, room, channels, channel, friends, friend, messages, users, requests, modal, invites } = action.payload;
  switch (action.type) {
    case 'initialize': {
      return {
        ...state,
        view,
        rooms,
        room,
        channels,
        channel,
        friends,
        friend,
        messages,
        users,
        requests,
        invites
      };
    }
    case 'initialize_room': {
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
        direct,
        friends,
        friend,
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
        channel,
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
    case 'update_direct': {
      return {
        ...state,
        direct
      };
    }
    case 'receive_direct_message': {
      return {
        ...state,
        messages
      };
    }
    case 'receive_direct_message_2': {
      return {
        ...state,
        direct,
        friends
      };
    }
    case 'receive_direct_message_3': {
      return {
        ...state,
        direct
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
        friends,
        friend
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
    case 'change_default': {
      return {
        ...state,
        friends,
        friend
      };
    }
    case 'update_rooms': {
      return {
        ...state,
        rooms,
        room,
        channels,
        channel
      };
    }
    case 'change_direct_22': {
      return {
        ...state,
        view,
        friends,
        friend,
        requests,
        invites
      }
    }
    case 'create_channel': {
      return {
        ...state,
        modal,
        channels
      };
    }
    case 'update_requests': {
      return {
        ...state,
        requests
      };
    }
    case 'update_users': {
      return {
        ...state,
        users
      }
    }
    case 'update_invites': {
      return {
        ...state,
        invites
      };
    }
    default: {
      return state;
    }
  }
};

const Home = (props) => {
  const { session, credentials } = props;
  const [socket, setSocket] = useState(null);
  const [myUser, setMyUser] = useState({
    id: credentials.id,
    username: credentials.username,
    image: credentials.image,
    online: true
  });
  const [state, dispatch] = useReducer(reducer, {
    view: 'room',
    modal: false,
    direct: { notifications: 0 },
    rooms: [],
    room: { id: null },
    channels: [],
    channel: { id: null },
    friends: [],
    friend: { id: 'default' },
    messages: [],
    users: [],
    requests: [],
    invites: []
  });
  const viewRef = useRef('room');
  const directRef = useRef({ notifications: 0 });
  const roomsRef = useRef({});
  const roomRef = useRef({});
  const channelsRef = useRef({});
  const channelRef = useRef({});
  const friendsRef = useRef({});
  const friendRef = useRef({});
  const messagesRef = useRef({});
  const usersRef = useRef({});
  const requestsRef = useRef({});
  const invitesRef = useRef({});

  const [content, setContent] = useState('');
  const updateContent = (e) => {
    setContent(e.target.value);
  };


  // Checked START
  const sendRoomInvite = (username) => {
    socket.emit('to:server:send_room_invite', {
      room: state.room,
      requester: myUser,
      username
    });
  };

  const wsReceiveRoomInvite = (invite) => {
    invitesRef.current[invite.id] = invite;
    const invites = Object.values(invitesRef.current);
    dispatch({
      type: 'update_invites',
      payload: {
        invites
      }
    });
  };

  const respondRoomInvite = ({ invite, status }) => {
    socket.emit('to:server:respond_room_invite', { myUser, invite, status });
  };

  const wsRespondRoomInvite = ({ room_id, user }) => {
    usersRef.current[room_id][user.id] = user;
    if (room_id === roomRef.current.id) {
      const users = Object.values(usersRef.current[room_id]);
      dispatch({
        type: 'update_users',
        payload: {
          users
        }
      });
    }
  };

  const wsUpdateRoomInvite = (invite_id) => {
    delete invitesRef.current[invite_id];
    const invites = Object.values(invitesRef.current);
    dispatch({
      type: 'update_invites',
      payload: {
        invites
      }
    });
  };

  const wsJoinedRoom = async ({ wsRoom, wsChannels, onlineUserIds } ) => {
    const rooms = initializeRooms({ rooms: [wsRoom], roomsRef });
    const room = roomRef.current = roomsRef.current[wsRoom.id];
    const channels = initializeChannels({ room_id: room.id, channels: wsChannels, channelsRef });
    const channel = channelRef.current = channels[0];
    const messages = await getMessages({ room_id: room.id, channel_id: channel.id, messagesRef });
    const users = await getUsers({ room_id: room.id, usersRef, onlineUserIds });
    const view = viewRef.current = 'room';
    dispatch({
      type: 'initialize_room',
      payload: {
        view,
        rooms,
        room,
        channels,
        channel,
        messages,
        users
      }
    });
  };

  const createRoom = async (room_name) => {
    socket.emit('to:server:create_room', {
      room_name,
      myUser
    });
    updateModal(false);
  };

  const wsCreateRoom = ({ wsRoom, wsChannel }) => {
    const rooms = initializeRooms({ rooms: [wsRoom], roomsRef });
    const room = roomRef.current = roomsRef.current[wsRoom.id];
    const channels = initializeChannels({ room_id: room.id, channels: [wsChannel], channelsRef });
    const channel = channelRef.current = channels[0];
    messagesRef.current[room.id] = {};
    const messages = messagesRef.current[room.id][channel.id] = [];
    const users = initializeUsers({ room_id: room.id, users: [myUser], usersRef, onlineUserIds: [myUser.id] });
    const view = viewRef.current = 'room';
    dispatch({
      type: 'change_room',
      payload: {
        view,
        rooms,
        room,
        channels,
        channel,
        messages,
        users
      }
    });
  };

  const createChannel = async (channel_name) => {
    socket.emit('to:server:create_channel', {
      room_id: state.room.id,
      channel_name
    });
    updateModal(false);
  };

  const wsCreateChannel = (channel) => {
    const channels = initializeChannels({ room_id: channel.room_id, channels: [channel], channelsRef });
    dispatch({
      type: 'create_channel',
      payload: {
        modal: false,
        channels
      }
    });
  };

  useEffect(() => {
    const connection = io('http://localhost:3003/', { autoConnect: false });
    setSocket(connection);
  }, [])
  // CHECKED END









  const sendFriendRequest = async (username) => {
    socket.emit('to:server:send_friend_request', {
      username,
      requester: {
        id: myUser.id,
        username: myUser.username,
        image: myUser.image
      }
    });
  };

  const sendFriendResponse = ({ request, status }) => {
    socket.emit('to:server:send_friend_response', { request, status });
  };




  const changeDirect = async () => {
    if (!usersRef.current.direct) {
      console.log('changeDirect 1');
      const friends = Object.values(friendsRef.current);
      socket.emit('to:server:change_direct', friends);
    }

    // else if () {

    // }

    else {
      console.log('changeDirect 2');
      console.log('friendsRef', {...friendsRef.current});
      console.log('friendRef', {...friendRef.current});
      const { friend } = state;
      if (!messagesRef.current[friend.room_id]) {
        console.log('type 1');
        const messages = await getDirectMessages({ messagesRef, room_id: friend.room_id });
        const view = viewRef.current = 'direct';
        // dispatch({
        //   type: 'change_direct',
        //   payload: {
        //     view,
        //     messages
        //   }
        // });
      } else {
        console.log('type 2');
        const messages = messagesRef.current[friend.room_id].slice();
        const view = viewRef.current = 'direct';
        dispatch({
          type: 'change_direct',
          payload: {
            view,
            messages
          }
        });
      }
    }
  };

  const changeFriend = async (friend_id) => {
    if (friend_id === state.friend.id) return;
    if (friend_id === 'default') {
      const friends = Object.values(friendsRef.current);
      const friend = friendRef.current = { id: 'default' };
      dispatch({
        type: 'change_default',
        payload: {
          friends,
          friend
        }
      });
      return;
    }
    directRef.current.notifications -= friendsRef.current[friend_id].notifications;
    friendsRef.current[friend_id].notifications = 0;
    const direct = { ...directRef.current };
    const friends = Object.values(friendsRef.current);
    const friend = friendRef.current = friendsRef.current[friend_id];
    const messages = await getDirectMessages({ messagesRef, room_id: friend.room_id });
    dispatch({
      type: 'change_friend',
      payload: {
        direct,
        friends,
        friend,
        messages
      }
    });
  };

  const changeRoom = async (room_id) => {
    if (state.view === 'room' && room_id === state.room.id) return;
    if (!messagesRef.current[room_id]) {
      socket.emit('to:server:change_room', room_id);
    } else {
      const { rooms, room, channels, channel } = updateRoomsChannels({ roomsRef, roomRef, channelsRef, channelRef, room_id });
      const messages = messagesRef.current[room_id][channel.id].slice();
      const users = Object.values(usersRef.current[room_id]);
      const view = viewRef.current = 'room';
      dispatch({
        type: 'change_room',
        payload: {
          view,
          rooms,
          room,
          channels,
          channel,
          messages,
          users
        }
      });
    }
  };

  const changeChannel = async (channel_id) => {
    if (channel_id === state.channel.id) return;
    const { rooms, room, channels, channel } = updateRoomsChannels({
      roomsRef,
      roomRef,
      channelsRef,
      channelRef,
      room_id: state.room.id,
      channel_id
    });
    if (!messagesRef.current[room.id][channel.id]) {
      await getMessages({ messagesRef, room_id: room.id, channel_id: channel.id });
    }
    const messages = messagesRef.current[room.id][channel.id].slice();
    dispatch({
      type: 'change_channel',
      payload: {
        rooms,
        channels,
        channel,
        messages
      }
    });
  };

  const wsInitialize = async ({ wsRooms, wsChannels, wsFriends, wsRequests, wsInvites, onlineUserIds }) => {
    console.log('wsIntialize!');
    const friends = initializeFriends({ friends: wsFriends, friendsRef });
    const friend = friendRef.current = { id: 'default' };
    const requests = initializeRequests({ requests: wsRequests, requestsRef });
    const invites = initializeInvites({ invites: wsInvites, invitesRef });


    if (wsRooms.length) {
      const rooms = initializeRooms({ rooms: wsRooms, roomsRef });
      const room = roomRef.current = rooms[0];
      const channels = initializeChannels({ room_id: room.id, channels: wsChannels, channelsRef });
      const channel = channelRef.current = channels[0];
      const messages = await getMessages({ room_id: room.id, channel_id: channel.id, messagesRef });
      const users = await getUsers({ room_id: room.id, usersRef, onlineUserIds });
      const view = viewRef.current = 'room';
      dispatch({
        type: 'initialize',
        payload: {
          view,
          rooms,
          room,
          channels,
          channel,
          friends,
          friend,
          messages,
          users,
          requests,
          invites
        }
      });
    } else {
      const friends = Object.values(friendsRef.current);
      socket.emit('to:server:change_direct2', { friends, requests, invites });
      // dispatch({
      //   type: 'update_requests',
      //   payload: {
      //     requests,
      //     invites
      //   }
      // });
      // changeDirect();
    }
  };

  const wsChangeDirect2 = ({ onlineUserIds, requests, invites }) => {
    console.log('wsChangeDirect2');
    // usersRef.current.direct = true;
    const friends = updateFriendsStatus({ friendsRef, onlineUserIds });
    console.log('friends 2', friends);
    const friend = friendRef.current;
    const view = viewRef.current = 'direct';
    dispatch({
      type: 'change_direct_22',
      payload: {
        view,
        friends,
        friend,
        requests,
        invites
      }
    });
  };

  const wsChangeDirect = ({ onlineUserIds }) => {
    console.log('wsChangeDirect');
    usersRef.current.direct = true;
    const friends = updateFriendsStatus({ friendsRef, onlineUserIds });
    const friend = friendRef.current;
    const view = viewRef.current = 'direct';
    dispatch({
      type: 'change_direct_f',
      payload: {
        view,
        friends,
        friend
      }
    });
  };

  const wsChangeRoom = async ({ room_id, onlineUserIds }) => {
    console.log('wsChangeRoom');
    const { rooms, room, channels, channel } = updateRoomsChannels({ roomsRef, roomRef, room_id, channelsRef, channelRef });
    const messages = await getMessages({ room_id: room.id, channel_id: channel.id, messagesRef });
    const users = await getUsers({ room_id: room.id, channel_id: channel.id, messagesRef, usersRef, onlineUserIds });
    const view = viewRef.current = 'room';
    dispatch({
      type: 'change_room',
      payload: {
        view,
        rooms,
        room,
        channels,
        channel,
        messages,
        users
      }
    });
  };

  const sendMessage = (e) => {
    console.log('sendMessage');
    e.preventDefault();
    if (!content) return;
    if (state.view === 'room') {
      socket.emit('to:server:room:send_message', {
        username: myUser.username,
        image: myUser.image,
        user_id: myUser.id,
        room_id: state.room.id,
        channel_id: state.channel.id,
        content
      });
    } else {
      socket.emit('to:server:direct:send_message', {
        username: myUser.username,
        image: myUser.image,
        user_id: myUser.id,
        room_id: state.friend.room_id,
        content
      });
    }
    setContent('');
  };

  const wsReceiveRoomMessage = ({ message }) => {
    console.log('wsReceiveRoomMessage');
    const view = viewRef.current;
    const room = roomRef.current;
    const channel = channelRef.current;
    if (view === 'direct' || view === 'room' && message.room_id !== room.id ) {
      roomsRef.current[message.room_id].notifications++;
      const rooms = Object.values(roomsRef.current);
      channelsRef.current[message.room_id][message.channel_id].notifications++;
      dispatch({
        type: 'update_notifications_r',
        payload: {
          rooms
        }
      });
    }

    else if (view === 'room' && message.room_id === room.id && message.channel_id !== channel.id) {
      roomsRef.current[message.room_id].notifications++;
      const rooms = Object.values(roomsRef.current);
      channelsRef.current[message.room_id][message.channel_id].notifications++;
      const channels = Object.values(channelsRef.current[message.room_id]);
      dispatch({
        type: 'update_notifications_rc',
        payload: {
          rooms,
          channels
        }
      });
    }

    else if (view === 'room' && message.room_id === room.id && message.channel_id === channel.id) {
      messagesRef.current[room.id][channel.id].push(message);
      const messages = messagesRef.current[room.id][channel.id].slice();
      dispatch({
        type: 'receive_room_message',
        payload: {
          messages
        }
      });
    }



    // if (message.room_id === room.id && message.channel_id === channel.id) {
    //   messagesRef.current[room.id][channel.id].push(message);
    //   const messages = messagesRef.current[room.id][channel.id].slice();
    //   dispatch({
    //     type: 'receive_room_message',
    //     payload: {
    //       messages
    //     }
    //   });
    // } else {
    //   roomsRef.current[message.room_id].notifications++;
    //   const rooms = Object.values(roomsRef.current);
    //   channelsRef.current[message.room_id][message.channel_id].notifications++;
    //   if (message.room_id === room.id) {
    //     const channels = Object.values(channelsRef.current[message.room_id]);
    //     dispatch({
    //       type: 'update_notifications_rc',
    //       payload: {
    //         rooms,
    //         channels
    //       }
    //     });
    //   } else {
    //     dispatch({
    //       type: 'update_notifications_r',
    //       payload: {
    //         rooms
    //       }
    //     });
    //   }
    // }
  };

  const wsReceiveDirectMessage = ({ message }) => {
    console.log('wsReceiveDirectMessage');
    const view = viewRef.current;
    const friend = friendRef.current;
    if (view === 'room') {
      console.log('1');
      if (messagesRef.current[message.room_id]) {
        messagesRef.current[message.room_id].push(message);
      }
      directRef.current.notifications++;
      const direct = { ...directRef.current };
      // if (friendsRef.current[message.user_id].notifications) {
      // }
      friendsRef.current[message.user_id].notifications++;
      dispatch({
        type: 'receive_direct_message_3',
        payload: {
          direct
        }
      });
    }

    else if (view === 'direct' && message.room_id !== friend.room_id) {
      console.log('2');
      console.log('2 friend', friend);
      console.log('2 message', message);
      if (messagesRef.current[message.room_id]) {
        messagesRef.current[message.room_id].push(message);
      }
      directRef.current.notifications++;
      const direct = { ...directRef.current };
      friendsRef.current[message.user_id].notifications++;
      const friends = Object.values(friendsRef.current);
      dispatch({
        type: 'receive_direct_message_2',
        payload: {
          direct,
          friends
        }
      });
    }

    else if (view === 'direct' && message.room_id === friend.room_id) {
      console.log('3');
      messagesRef.current[message.room_id].push(message);
      const messages = messagesRef.current[message.room_id].slice();
      dispatch({
        type: 'receive_direct_message',
        payload: {
          messages
        }
      });
    }

    // if (viewRef.current === 'direct') {
    //   const friend = friendRef.current;
    //   if (message.room_id === friend.id) {
    //     messagesRef.current[friend.id].push(message);
    //     const messages = messagesRef.current[friend.id].slice();
    //     dispatch({
    //       type: 'receive_direct_message',
    //       payload: {
    //         messages
    //       }
    //     });
    //   }

    //   if (message.room_id !== friend.id) {
    //     directRef.current.notifications++;
    //     const direct = { ...directRef.current };
    //     friendsRef.current[message.room_id].notifications++;
    //     const friends = Object.values(friendsRef.current);
    //     dispatch({
    //       type: 'receive_direct_message_2',
    //       payload: {
    //         direct,
    //         friends
    //       }
    //     });
    //   }
    // }

    // if (viewRef.current === 'room') {
    //   directRef.current.notifications++;
    //   const direct = { ...directRef.current };

    //   friendsRef.current[message.room_id].notifications++;
    //   if (messagesRef.current[message.room_id]) {
    //     messagesRef.current[message.room_id].push(message);
    //   }
    //   dispatch({
    //     type: 'update_direct',
    //     payload: {
    //       direct
    //     }
    //   });
    // }
  };

  const wsReceiveFriendRequest = async (request) => {
    requestsRef.current[request.id] = request;
    const requests = Object.values(requestsRef.current);
    dispatch({
      type: 'receive_friend_request',
      payload: {
        requests
      }
    });
  };

  const wsReceiveFriendResponse = ({ friend, request }) => {
    console.log('wsReceiveFriendResponse');
    friend.notifications = 0;
    friendsRef.current[friend.id] = friend;
    const friends = Object.values(friendsRef.current);
    delete requestsRef.current[request.id];
    const requests = Object.values(requestsRef.current);
    dispatch({
      type: 'receive_friend_request_response',
      payload: {
        friends,
        requests
      }
    });
  };

  const wsUpdateUsers = ({ user, room_id }) => {
    console.log('wsUpdateUsers');
    if (!usersRef.current[room_id]) return;
    usersRef.current[room_id][user.id].online = user.online;
    const room = roomRef.current;
    if (room_id !== room.id) return;
    const users = Object.values(usersRef.current[room.id]);
    dispatch({
      type: 'update_users',
      payload: {
        users
      }
    });
  };

  const wsUpdateFriends = ({ friend }) => {
    console.log('wsUpdateFriends', friend.online);
    friendsRef.current[friend.id].online = friend.online;
    const friends = Object.values(friendsRef.current);
    dispatch({
      type: 'update_friends',
      payload: {
        friends
      }
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on('to:client:initialize', wsInitialize);
      socket.on('to:client:room:receive_message', wsReceiveRoomMessage);
      socket.on('to:client:direct:receive_message', wsReceiveDirectMessage);
      socket.on('to:client:change_room', wsChangeRoom);
      socket.on('to:client:update_users', wsUpdateUsers);
      socket.on('to:client:change_direct', wsChangeDirect);
      socket.on('to:client:change_direct2', wsChangeDirect2);
      socket.on('to:client:send_friend_request', wsReceiveFriendRequest);
      socket.on('to:client:receive_friend_response', wsReceiveFriendResponse);
      socket.on('to:client:update_friends', wsUpdateFriends);
      socket.on('to:client:create_room', wsCreateRoom);
      socket.on('to:client:create_channel', wsCreateChannel);
      socket.on('to:client:receive_room_invite', wsReceiveRoomInvite);
      socket.on('to:client:respond_room_invite', wsRespondRoomInvite);
      socket.on('to:client:joined_room', wsJoinedRoom);
      socket.on('to:client:update_room_invite', wsUpdateRoomInvite);
      socket.auth = myUser;
      socket.connect();
      return () => {
        socket.off('to:client:initialize', wsInitialize);
        socket.off('to:client:room:receive_message', wsReceiveRoomMessage);
        socket.off('to:client:direct:receive_message', wsReceiveDirectMessage);
        socket.off('to:client:change_room', wsChangeRoom);
        socket.off('to:client:update_users', wsUpdateUsers);
        socket.off('to:client:change_direct', wsChangeDirect);
        socket.off('to:client:change_direct2', wsChangeDirect2);
        socket.off('to:client:send_friend_request', wsReceiveFriendRequest);
        socket.off('to:client:receive_friend_response', wsReceiveFriendResponse);
        socket.off('to:client:update_friends', wsUpdateFriends);
        socket.off('to:client:create_room', wsCreateRoom);
        socket.off('to:client:create_channel', wsCreateChannel);
        socket.off('to:client:receive_room_invite', wsReceiveRoomInvite);
        socket.off('to:client:respond_room_invite', wsRespondRoomInvite);
        socket.off('to:client:joined_room', wsJoinedRoom);
        socket.off('to:client:update_room_invite', wsUpdateRoomInvite);
      };
    }
  }, [socket, myUser])


  const updateModal = (status) => {
    dispatch({
      type: 'update_modal',
      payload: {
        modal: status
      }
    });
  };

  useEffect(() => {
    console.log('test1', state.friends);
    console.log('test2', state.friend);
  }, [state.friends, state.friend])

  return (
    <div className={styles.container}>
      <Sidebar direct={state.direct} changeDirect={changeDirect} rooms={state.rooms} room={state.room} changeRoom={changeRoom} updateModal={updateModal} />
      {state.view === 'room' ?
      <Room
        myUser={myUser}
        room={state.room}
        channels={state.channels}
        channel={state.channel}
        changeChannel={changeChannel}
        messages={state.messages}
        sendMessage={sendMessage}
        content={content}
        updateContent={updateContent}
        users={state.users}
        changeFriend={changeFriend}
        updateModal={updateModal} /> :
      <Direct
        myUser={myUser}
        friends={state.friends}
        friend={state.friend}
        changeFriend={changeFriend}
        messages={state.messages}
        sendMessage={sendMessage}
        content={content}
        updateContent={updateContent}
        requests={state.requests}
        invites={state.invites}
        sendFriendRequest={sendFriendRequest}
        sendFriendResponse={sendFriendResponse}
        respondRoomInvite={respondRoomInvite}
        updateModal={updateModal} />}

      {state.modal && <Modal modal={state.modal} updateModal={updateModal} createRoom={createRoom} createChannel={createChannel} sendRoomInvite={sendRoomInvite} />}
    </div>
  );
};

export default Home;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  const credentials = await getUser(session.user.name);
  return {
    props: {
      session,
      credentials
    }
  };
};