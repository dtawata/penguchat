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
  const { view, rooms, room, channels, channel, friends, friend, messages, users, requests, modal, invites } = action.payload;
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
    case 'update_friends': {
      return {
        ...state,
        friends
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

  const wsUpdateRoomInvite = ({ invite_id }) => {
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
    view.current = 'room';
    dispatch({
      type: 'initialize_room',
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
      const friends = Object.values(friendsRef.current);
      socket.emit('to:server:change_direct', friends);
    } else {
      const { friend } = state;
      if (!messagesRef.current[friend.id]) {
        await getDirectMessages({ messagesRef, friend_id: friend.id });
      }
      const messages = messagesRef.current[friend.id].slice();
      view.current = 'direct';
      dispatch({
        type: 'change_direct',
        payload: {
          view: view.current,
          messages
        }
      });
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
    // this should be a direct.current keeping track of the notifications
    // friendsRef.current[friend.id].notifications -= friend.notifications;
    // friend.notifications = 0;
    const friends = Object.values(friendsRef.current);
    const friend = friendRef.current = friendsRef.current[friend_id];
    const messages = await getDirectMessages({ messagesRef, friend_id: friend.id });
    dispatch({
      type: 'change_friend',
      payload: {
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
          friend,
          messages,
          users,
          requests,
          invites
        }
      });
    } else {
      dispatch({
        type: 'update_requests',
        payload: {
          requests,
          invites
        }
      });
      changeDirect();
    }
  };

  const wsChangeDirect = ({ wsFriends }) => {
    usersRef.current.direct = true;
    const friends = updateFriendsStatus(wsFriends, friendsRef);
    const friend = friendRef.current;
    view.current = 'direct';
    dispatch({
      type: 'change_direct_f',
      payload: {
        view: view.current,
        friends,
        friend
      }
    });
  };

  const wsChangeRoom = async ({ room_id, onlineUserIds }) => {
    const { rooms, room, channels, channel } = updateRoomsChannels({ roomsRef, roomRef, room_id, channelsRef, channelRef });
    const messages = await getMessages({ room_id: room.id, channel_id: channel.id, messagesRef });
    const users = await getUsers({ room_id: room.id, channel_id: channel.id, messagesRef, usersRef, onlineUserIds });
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

  const sendMessage = (e) => {
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
        room_id: state.friend.id,
        content
      });
    }
    setContent('');
  };

  const wsReceiveRoomMessage = ({ message }) => {
    const room = roomRef.current;
    const channel = channelRef.current;
    if (message.room_id === room.id && message.channel_id === channel.id) {
      messagesRef.current[room.id][channel.id].push(message);
      const messages = messagesRef.current[room.id][channel.id].slice();
      dispatch({
        type: 'receive_room_message',
        payload: {
          messages
        }
      });
    } else {
      roomsRef.current[message.room_id].notifications++;
      const rooms = Object.values(roomsRef.current);
      channelsRef.current[message.room_id][message.channel_id].notifications++;
      if (message.room_id === room.id) {
        const channels = Object.values(channelsRef.current[message.room_id]);
        dispatch({
          type: 'update_notifications_rc',
          payload: {
            rooms,
            channels
          }
        });
      } else {
        dispatch({
          type: 'update_notifications_r',
          payload: {
            rooms
          }
        });
      }
    }
  };

  const wsReceiveDirectMessage = ({ message }) => {
    if (view.current === 'room') {
      friendsRef.current[message.room_id].notifications++;
      if (messagesRef.current[message.room_id]) {
        messagesRef.current[message.room_id].push(message);
      }
    } else {
      const friend = friendRef.current;
      if (message.room_id === friend.id) {
        messagesRef.current[friend.id].push(message);
        const messages = messagesRef.current[friend.id].slice();
        dispatch({
          type: 'receive_direct_message',
          payload: {
            messages
          }
        });
      } else {
        friendsRef.current[message.room_id].notifications++;
        const friends = Object.values(friendsRef.current);
        dispatch({
          type: 'update_friends',
          payload: {
            friends,
          }
        });
      }
    }
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
    if (!usersRef.current[room_id]) return;
    usersRef.current[room_id][user.id] = user;
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
    if (!usersRef.current.direct) return;
    friendsRef.current[friend.id] = friend;
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

  return (
    <div className={styles.container}>
      <Sidebar changeDirect={changeDirect} rooms={state.rooms} room={state.room} changeRoom={changeRoom} updateModal={updateModal} />
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