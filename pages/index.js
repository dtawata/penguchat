import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect, useReducer } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { getUser } from '../lib/mysql';
import { io } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import Room from '@/components/room/Room';

const reducer = (state, action) => {
  const { rooms, channels, messages, users } = action.payload;
  switch (action.type) {
    case 'initialize': {
      return {
        ...state,
        rooms,
        channels,
        messages,
        users
      };
    }
    case 'receive_message': {
      return {
        ...state,
        messages
      };
    }
    case 'change_room': {
      return {
        ...state,
        channels,
        messages,
        users
      };
    }
    case 'change_channel': {
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
    default: {
      return state;
    }
  }
};

const Home = (props) => {
  const { session, myuser } = props;
  const [socket, setSocket] = useState(null);
  const [state, dispatch] = useReducer(reducer, {
    rooms: [],
    channels: [],
    messages: [],
    users: []
  });
  const [content, setContent] = useState('');
  const roomRef = useRef({});
  const channelRef = useRef({});
  const channelsRef = useRef({});
  const messagesRef = useRef({});
  const usersRef = useRef({});

  const changeRoom = async (room) => {
    if (roomRef.current.id === room.id) return;
    roomRef.current = room;
    if (!messagesRef.current[room.id]) {
      socket.emit('to:server:change_room', room);
    } else {
      const channels = Object.values(channelsRef.current[room.id]);
      channelRef.current = channels[0];
      const channel = channelRef.current;
      const messages = messagesRef.current[room.id][channel.id].slice();
      const users = Object.values(usersRef.current[room.id]);
      dispatch({
        type: 'change_room',
        payload: {
          channels,
          messages,
          users
        }
      });
    }
  };

  const changeChannel = async (channel) => {
    if (channelRef.current.id === channel.id) return;
    const room = roomRef.current;
    channelRef.current = channel;
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
        messages
      }
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!content) return;
    socket.emit('to:server:send_message', {
      username: myuser.username,
      image: myuser.image,
      user_id: myuser.id,
      room_id: roomRef.current.id,
      channel_id: channelRef.current.id,
      content
    });
    setContent('');
  };

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const wsInitialize = async ({ wsRooms, wsChannels, wsUsers }) => {
    const rooms = wsRooms;
    roomRef.current = rooms[0];
    const room = roomRef.current;
    for (const channel of wsChannels) {
      channelsRef.current[channel.room_id] = channelsRef.current[channel.room_id] || {};
      channelsRef.current[channel.room_id][channel.id] = channel;
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
    for (const user of wsUsers) {
      usersRef.current[room.id][user.id].online = true;
    }
    const users = Object.values(usersRef.current[room.id]);
    dispatch({
      type: 'initialize',
      payload: {
        rooms,
        channels,
        messages,
        users
      }
    });
  };

  const wsReceiveMessage = (wsMessage) => {
    messagesRef.current[wsMessage.room_id][wsMessage.channel_id].push(wsMessage);
    const messages = messagesRef.current[wsMessage.room_id][wsMessage.channel_id].slice();
    dispatch({
      type: 'receive_message',
      payload: {
        messages
      }
    });
  };

  const wsChangeRoom = async ({ wsRoom, wsUsers }) => {
    roomRef.current = wsRoom;
    const room = roomRef.current;
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
    usersRef.current[room.id] = {};
    for (const user of data.users) {
      usersRef.current[room.id][user.id] = user;
    }
    for (const user of wsUsers) {
      usersRef.current[room.id][user.id].online = true;
    }
    const messages = messagesRef.current[room.id][channel.id].slice();
    const users = Object.values(usersRef.current[room.id]);
    dispatch({
      type: 'change_room',
      payload: {
        channels,
        messages,
        users
      }
    });
  };

  const wsUpdateUsers = ({ wsStatus, wsUser }) => {
    if (!usersRef.current[wsUser.room_id]) return;
    const user = wsUser;
    usersRef.current[user.room_id][user.id].online = wsStatus;
    const room = roomRef.current;
    if (user.room_id !== room.id) return;
    const users = Object.values(usersRef.current[room.id]);
    dispatch({
      type: 'update_users',
      payload: {
        users
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
      socket.on('to:client:receive_message', wsReceiveMessage);
      socket.on('to:client:change_room', wsChangeRoom);
      socket.on('to:client:update_users', wsUpdateUsers);
      socket.auth = myuser;
      socket.connect();
      return () => {
        socket.off('initialize', wsInitialize);
        socket.off('receive_message', wsReceiveMessage);
        socket.off('to:client:change_room', wsChangeRoom);
        socket.off('update_users', wsUpdateUsers);
      };
    }
  }, [socket, myuser])

  return (
    <div className={styles.container}>
      <Sidebar rooms={state.rooms} changeRoom={changeRoom} />
      <Room channels={state.channels} changeChannel={changeChannel} content={content} updateContent={updateContent} messages={state.messages} sendMessage={sendMessage} users={state.users} />
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


//   const [state, dispatch] = useReducer(reducer, {
//     view: 'group',
//     rooms: [],
//     room: {},
//     channels: [],
//     channel: {},
//     direct: {},
//     friends: [],
//     friend: {},
//     messages: [],
//     users: []
//   });