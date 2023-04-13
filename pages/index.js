import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect, useReducer } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { getUser } from '../lib/mysql';
import { io } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '@/components/sidebar/Sidebar';
import Room from '@/components/room/Room';

const reducer = (state, action) => {
  const { rooms, room, channels, channel, messages, users } = action.payload;
  switch (action.type) {
    case 'initialize': {
      return {
        ...state,
        rooms,
        room,
        channels,
        channel,
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
        channel,
        messages
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
    room: {},
    channels: [],
    channel: {},
    messages: [],
    users: []
  });
  const [content, setContent] = useState('');
  const channelsRef = useRef({});
  const messagesRef = useRef({});
  const usersRef = useRef({});

  const changeRoom = async (room) => {
    if (state.room.id === room.id) return;
    if (!messagesRef.current[room.id]) {
      socket.emit('request_users', room);
    } else {
      const channels = Object.values(channelsRef.current[room.id]);
      const channel = channels[0];
      const messages = messagesRef.current[room.id][channel.id].slice();
      const users = Object.values(usersRef.current[room.id]);
      dispatch({
        type: 'change_room',
        payload: {
          room,
          channels,
          channel,
          messages,
          users
        }
      });
    }
  };

  const changeChannel = async (channel) => {
    if (state.channel.id === channel.id) return;
    if (!messagesRef.current[state.room.id][channel.id]) {
      const { data } = await axios.get('/api/messages', {
        params: {
          room_id: state.room.id,
          channel_id: channel.id
        }
      });
      messagesRef.current[state.room.id][channel.id] = data.messages;
    }
    const messages = messagesRef.current[state.room.id][channel.id].slice();
    dispatch({
      type: 'change_channel',
      payload: {
        channel,
        messages
      }
    });
  };

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!content) return;
    socket.emit('send_message', {
      username: user.username,
      image: user.image,
      user_id: user.id,
      room_id: state.room.id,
      channel_id: state.channel.id,
      content
    });
    setContent('');
  };

  const wsInitialize = async (ws) => {
    const { rooms } = ws;
    const room = rooms[0];
    for (const channel of ws.channels) {
      channelsRef.current[channel.room_id] = channelsRef.current[channel.room_id] || {};
      channelsRef.current[channel.room_id][channel.id] = channel;
    }
    const channels = Object.values(channelsRef.current[room.id]);
    const channel = channels[0];
    const { data } = await axios.get('/api/initialize', {
      params: {
        room_id: room.id,
        channel_id: channel.id
      }
    });
    messagesRef.current[room.id] = {};
    messagesRef.current[room.id][channel.id] = data.messages;
    const messages = messagesRef.current[room.id][channel.id].slice();
    usersRef.current[room.id] = {}
    for (const user of data.users) {
      usersRef.current[room.id][user.id] = user;
    }
    for (const user of ws.users) {
      usersRef.current[room.id][user.id].online = true;
    }
    const users = Object.values(usersRef.current[room.id]);
    dispatch({
      type: 'initialize',
      payload: {
        rooms,
        room,
        channels,
        channel,
        messages,
        users
      }
    });
  };

  const wsReceiveMessage = (message) => {
    dispatch({
      type: 'receive_message',
      payload: {
        messages: state.messages.concat(message)
      }
    });
  };

  const wsChangeRoom = async (ws) => {
    const { room } = ws;
    const channels = Object.values(channelsRef.current[room.id]);
    const channel = channels[0];
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
    for (const user of ws.users) {
      usersRef.current[room.id][user.id].online = true;
    }
    const messages = messagesRef.current[room.id][channel.id].slice();
    const users = Object.values(usersRef.current[room.id]);
    dispatch({
      type: 'change_room',
      payload: {
        room,
        channels,
        channel,
        messages,
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
      socket.on('initialize', wsInitialize);
      socket.on('receive_message', wsReceiveMessage);
      socket.on('change_room', wsChangeRoom);
      socket.auth = myuser;
      socket.connect();
      return () => {
        socket.off('initialize', wsInitialize);
        socket.off('receive_message', wsReceiveMessage);
        socket.off('change_room', wsChangeRoom);
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