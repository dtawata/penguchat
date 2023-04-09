
// import Direct from '@/components/direct/Direct';
// import Group from '@/components/group/Group';


// const reducer = (state, action) => {
//   const { view, direct, rooms, room, channels, channel, friends, friend, messages, users } = action.payload;
//   switch (action.type) {
//     case 'rooms':
//       return { ...state, rooms, channels };
//     default:
//       return state;
//   }
// };

// const Home = (props) => {


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


//   // const group = useRef({});
//   // const direct = useRef({
//   //   messages: {},
//   //   users: {}
//   // });


//   const wsInitialize = (ws) => {
//     console.log('ws', ws);
//     dispatch({
//       type: 'rooms',
//       payload: {
//         rooms: ws.rooms,
//         channels: ws.channels
//       }
//     });
//   };

//   const wsReceiveGroupMessage = (w) => {
//     console.log('ws', ws);
//   };


//   useEffect(() => {
//     if (socket) {
//       socket.on('initialize', wsInitialize);
//       socket.auth = user;
//       socket.connect();

//       return () => {
//         socket.off('initialize', wsInitialize);
//       };
//     }
//   }, [socket])

//   const changeChannel = async (channel) => {
//     const { data } = await axios.get('http://localhost:3000/api/messages', {
//       params: {
//         room_id: state.room.id,
//         channel_id: channel.id
//       }
//     });
//     console.log('yo', data);
//   };





import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect, useReducer } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { getUser } from '../lib/mysql';
import { io } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '@/components/sidebar/Sidebar';
import Room from '@/components/room/Room';

const reducer = (state, action) => {
  const { rooms, room, channels, channel, message } = action.payload;
  switch (action.type) {
    case 'rooms:channels': {
      return {
        ...state,
        rooms,
        room,
        channels,
        channel
      }
    }
    case 'messages': {
      return {
        ...state,
        messages: state.messages.concat(message)
      }
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
    messages: ['','2']
  });
  const channelsRef = useRef({});
  const [content, setContent] = useState('');

  useEffect(() => {
    const connection = io('http://localhost:3003/', { autoConnect: false });
    setSocket(connection);
  }, [])

  const wsInitialize = async (ws) => {
    const { rooms } = ws;
    const room = rooms[0];
    for (const channel of ws.channels) {
      channelsRef.current[channel.room_id] = channelsRef.current[channel.room_id] || {};
      channelsRef.current[channel.room_id][channel.id] = channel;
    }
    const channels = Object.values(channelsRef.current[room.id]);
    const channel = channels[0];
    const { data } = await axios.get('/api/messages', {
      params: {
        room_id: room.id,
        channel_id: channel.id
      }
    });

    console.log('data', data);


    dispatch({
      type: 'rooms:channels',
      payload: {
        rooms,
        room,
        channels,
        channel
      }
    });
  };

  const wsReceiveMessage = (message) => {
    console.log(message);
    dispatch({
      type: 'messages',
      payload: {
        message
      }
    });
  };

  useEffect(() => {
    console.log('user', user);
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
    console.log('hello', content);
    socket.emit('send_message', {
      username: user.username,
      image: user.image,
      user_id: user.id,
      room_id: state.room.id,
      channel_id: state.channel.id,
      content
    });
  };

  return (
    <div className={styles.container}>
      <Sidebar rooms={state.rooms} />
      <Room channels={state.channels} content={content} updateContent={updateContent} sendMessage={sendMessage} messages={state.messages} />
      {/* <Group state={state} content={content} updateContent={updateContent} changeChannel={changeChannel} /> */}
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