import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect, useReducer } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { getUser } from '../lib/mysql';
import { io } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '@/components/sidebar/Sidebar';
import Room from '@/components/room/Room';

const reducer = (state, action) => {
  const { rooms, room, channels, channel, message, messages, users } = action.payload;
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
        messages: state.messages.concat(message)
      };
    }
    case 'change_channel': {
      return {
        ...state,
        channel,
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
    default: {
      return state;
    }
  }
};


const Home = (props) => {
  const { session, user } = props;
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

  useEffect(() => {
    const connection = io('http://localhost:3003/', { autoConnect: false });
    setSocket(connection);
  }, [])

  const changeRoom = async (room) => {
    const channels = Object.values(channelsRef.current[room.id]);
    const channel = channels[0];
    const { data } = await axios.get('http://localhost:3000/api/messages', {
      params: {
        room_id: state.room.id,
        channel_id: channel.id
      }
    });

    dispatch({
      type: 'change_room',
      payload: {
        room,
        channels,
        channel,
        messages: data.messages,
        users: data.users
      }
    });
  };

  const changeChannel = async (channel) => {
    if (state.channel.id === channel.id) return;
    if (!messagesRef.current[state.room.id][channel.id]) {
      const { data } = await axios.get('http://localhost:3000/api/messages', {
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
    const users = data.users;
    for (const user of users) {
      usersRef.current[room.id][user.id] = user;
    }
    for (const user of ws.users) {
      usersRef.current[room.id][user.id].online = true;
    }
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
        message
      }
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on('initialize', wsInitialize);
      socket.on('receive_message', wsReceiveMessage);
      socket.auth = user;
      socket.connect();
      return () => {
        socket.off('initialize', wsInitialize);
      };
    }
  }, [socket, user])

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

  const user = await getUser(session.user.name);
  return {
    props: {
      session,
      user
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