import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect, useReducer } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { getUser } from '../lib/mysql';
import { io } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import Room from '@/components/room/Room';
import Direct from '@/components/direct/Direct';
import Modal from '@/components/Modal';

const reducer = (state, action) => {
  const { view, rooms, channels, friends, messages, users, requests, modal } = action.payload;
  switch (action.type) {
    case 'initialize': {
      return {
        ...state,
        view,
        rooms,
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
        channels,
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

const Home = (props) => {
  const { session, myuser } = props;
  const [socket, setSocket] = useState(null);
  const [state, dispatch] = useReducer(reducer, {
    view: 'room',
    modal: false,
    rooms: [],
    channels: [],
    friends: [],
    messages: [],
    users: []
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
  const [content, setContent] = useState('');
  const [friendContent, setFriendContent] = useState('');

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const updateFriendContent = (e) => {
    setFriendContent(e.target.value);
  };

  const updateModal = (status) => {
    dispatch({
      type: 'update_modal',
      payload: {
        modal: status
      }
    });
  };

  const changeDirect = async () => {
    if (!usersRef.current.direct) {
      const friends = Object.values(friendsRef.current);
      socket.emit('to:server:change_direct', friends);
    } else {
      const friend = friendRef.current;
      if (!messagesRef.current[friend.id]) {
        const { data } = await axios.get('/api/direct', {
          params: {
            friend_id: friend.id
          }
        });
        messagesRef.current[friend.id] = data.messages;
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

  const changeRoom = async (room_id) => {
    if (state.view === 'room' && room_id === roomRef.current.id) return;
    roomRef.current = roomsRef.current[room_id];
    if (!messagesRef.current[room_id]) {
      socket.emit('to:server:change_room', room_id);
    } else {
      const channels = Object.values(channelsRef.current[room_id]);
      channelRef.current = channels[0];
      const channel = channelRef.current;
      roomsRef.current[room_id].notifications -= channel.notifications;
      channel.notifications = 0;
      const rooms = Object.values(roomsRef.current);
      const messages = messagesRef.current[room_id][channel.id].slice();
      const users = Object.values(usersRef.current[room_id]);
      view.current = 'room';
      dispatch({
        type: 'change_room',
        payload: {
          view: view.current,
          rooms,
          channels,
          messages,
          users
        }
      });
    }
  };

  const changeChannel = async (channel_id) => {
    if (channel_id === channelRef.current.id) return;
    const room = roomRef.current;
    channelRef.current = channelsRef.current[room.id][channel_id];
    const channel = channelRef.current;
    roomsRef.current[room.id].notifications -= channel.notifications;
    channel.notifications = 0;
    const rooms = Object.values(roomsRef.current);
    const channels = Object.values(channelsRef.current[room.id]);
    if (!messagesRef.current[room.id][channel.id]) {
      const { data } = await axios.get('/api/messages', {
        params: {
          room_id: room.id,
          channel_id: channel.id
        }
      });
      messagesRef.current[room.id][channel.id] = data.messages;
    }
    const messages = messagesRef.current[room.id][channel.id].slice();
    dispatch({
      type: 'change_channel',
      payload: {
        rooms,
        channels,
        messages
      }
    });
  };

  const changeFriend = async (friend_id) => {
    if (friend_id === friendRef.current.id) return;
    if (friend_id === 'default') {
      friendRef.current = { id: 'default' };
      const friends = Object.values(friendsRef.current);

      dispatch({
        type: 'change_default',
        payload: {
          friends,
        }
      });
      return;
    }
    friendRef.current = friendsRef.current[friend_id];
    const friend = friendRef.current;
    // this should be a direct.current keeping track of the notifications
    // friendsRef.current[friend.id].notifications -= friend.notifications;
    // friend.notifications = 0;
    const friends = Object.values(friendsRef.current);
    if (!messagesRef.current[friend.id]) {
      const { data } = await axios.get('/api/direct', {
        params: {
          friend_id: friend.id
        }
      });
      messagesRef.current[friend.id] = data.messages;
    }
    const messages = messagesRef.current[friend.id].slice();
    dispatch({
      type: 'change_friend',
      payload: {
        friends,
        messages
      }
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!content) return;
    if (state.view === 'room') {
      socket.emit('to:server:room:send_message', {
        username: myuser.username,
        image: myuser.image,
        user_id: myuser.id,
        room_id: roomRef.current.id,
        channel_id: channelRef.current.id,
        content
      });
    } else {
      socket.emit('to:server:direct:send_message', {
        username: myuser.username,
        image: myuser.image,
        user_id: myuser.id,
        room_id: friendRef.current.id,
        content
      });
    }
    setContent('');
  };

  const sendFriendRequest = async (e) => {
    e.preventDefault();
    socket.emit('to:server:send_friend_request', {
      username: friendContent,
      requester: {
        id: myuser.id,
        username: myuser.username,
        image: myuser.image
      }
    });
    setFriendContent('');
  };

  const sendFriendRequestResponse = ({ request, status }) => {
    socket.emit('to:server:send_friend_request_response', { request, status });
  };

  const wsInitialize = async ({ rooms, wsChannels, friends, userIds, requests }) => {
    for (const friend of friends) {
      friendsRef.current[friend.id] = friend;
      friend.notifications = 0;
    }
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
        channels,
        friends,
        messages,
        users,
        requests
      }
    });
  };

  const wsChangeDirect = ({ wsFriends }) => {
    usersRef.current.direct = true;
    for (const friend of wsFriends) {
      friendsRef.current[friend.id] = friend;
    }
    const friends = Object.values(friendsRef.current);
    view.current = 'direct';
    dispatch({
      type: 'change_direct_f',
      payload: {
        view: view.current,
        friends
      }
    });
  };

  const wsChangeRoom = async ({ room_id, userIds }) => {
    roomRef.current = roomsRef.current[room_id];
    const room = roomRef.current;
    const channels = Object.values(channelsRef.current[room.id]);
    channelRef.current = channels[0];
    const channel = channelRef.current;
    roomsRef.current[room.id].notifications -= channel.notifications;
    channel.notifications = 0;
    const rooms = Object.values(roomsRef.current);
    const { data } = await axios.get('/api/initialize', {
      params: {
        room_id: room.id,
        channel_id: channel.id
      }
    });
    messagesRef.current[room.id] = {};
    messagesRef.current[room.id][channel.id] = data.messages;
    usersRef.current[room.id] = {};
    for (const user of data.users) {
      usersRef.current[room.id][user.id] = user;
    }
    for (const user_id of userIds) {
      usersRef.current[room.id][user_id].online = true;
    }
    const messages = messagesRef.current[room.id][channel.id].slice();
    const users = Object.values(usersRef.current[room.id]);
    view.current = 'room';
    dispatch({
      type: 'change_room',
      payload: {
        view: view.current,
        rooms,
        channels,
        messages,
        users
      }
    });
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
        const channels = Object.values(channelsRef.current[wsMessage.room_id]);
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

  const wsReceiveFriendRequestResponse = ({ friend, request }) => {
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
    const connection = io('http://localhost:3003/', { autoConnect: false });
    setSocket(connection);
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('to:client:initialize', wsInitialize);
      socket.on('to:client:room:receive_message', wsReceiveRoomMessage);
      socket.on('to:client:direct:receive_message', wsReceiveDirectMessage);
      socket.on('to:client:change_room', wsChangeRoom);
      socket.on('to:client:update_users', wsUpdateUsers);
      socket.on('to:client:change_direct', wsChangeDirect);
      socket.on('to:client:send_friend_request', wsReceiveFriendRequest);
      socket.on('to:client:receive_friend_request_response', wsReceiveFriendRequestResponse);
      socket.on('to:client:update_friends', wsUpdateFriends);
      socket.auth = myuser;
      socket.connect();
      return () => {
        socket.off('to:client:initialize', wsInitialize);
        socket.off('to:client:room:receive_message', wsReceiveRoomMessage);
        socket.off('to:client:direct:receive_message', wsReceiveDirectMessage);
        socket.off('to:client:change_room', wsChangeRoom);
        socket.off('to:client:update_users', wsUpdateUsers);
        socket.off('to:client:change_direct', wsChangeDirect);
        socket.off('to:client:send_friend_request', wsReceiveFriendRequest);
        socket.off('to:client:receive_friend_request_response', wsReceiveFriendRequestResponse);
        socket.off('to:client:update_friends', wsUpdateFriends);
      };
    }
  }, [socket, myuser])

  return (
    <div className={styles.container}>
      <Sidebar changeDirect={changeDirect} rooms={state.rooms} room={roomRef.current} changeRoom={changeRoom} updateModal={updateModal} />
      {state.view === 'room' ?
      <Room room={roomRef.current} channels={state.channels} channel={channelRef.current} changeChannel={changeChannel} content={content} updateContent={updateContent} messages={state.messages} sendMessage={sendMessage} users={state.users} changeFriend={changeFriend} /> :
      <Direct friends={state.friends} friend={friendRef.current} changeFriend={changeFriend} content={content} updateContent={updateContent} messages={state.messages} sendMessage={sendMessage} updateModal={updateModal} users={state.users} sendFriendRequest={sendFriendRequest} friendContent={friendContent} updateFriendContent={updateFriendContent} />}
      {state.modal && <Modal requests={state.requests} updateModal={updateModal} sendFriendRequestResponse={sendFriendRequestResponse} />}
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

  const myuser = await getUser(session.user.name);
  return {
    props: {
      session,
      myuser
    }
  };
};