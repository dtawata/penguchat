import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect, useReducer } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { getUser } from '../lib/mysql';
import { io } from 'socket.io-client';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import Room from '@/components/room/Room';
import Direct from '@/components/direct/Direct';

const reducer = (state, action) => {
  const { view, rooms, channels, friends, messages, users } = action.payload;
  switch (action.type) {
    case 'initialize': {
      return {
        ...state,
        view,
        rooms,
        channels,
        friends,
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
    case 'change_room': {
      return {
        ...state,
        view,
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
    case 'receive_message': {
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
    case 'update_notifications': {
      return {
        ...state,
        rooms,
        channels
      };
    }
    case 'update_room_notifications': {
      return {
        ...state,
        rooms
      };
    }
    case 'direct_receive_message': {
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
    case 'change_friend': {
      return {
        ...state,
        friends,
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
    view: 'room',
    rooms: [],
    channels: [],
    friends: [],
    messages: [],
    users: []
  });
  const [content, setContent] = useState('');
  const view = useRef('room');
  const roomsRef = useRef({});
  const roomRef = useRef({});
  const channelsRef = useRef({});
  const channelRef = useRef({});
  const friendsRef = useRef({});
  const friendRef = useRef({});
  const messagesRef = useRef({});
  const usersRef = useRef({});

  const changeDirect = async () => {
    console.log(friendRef.current);
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
        view: 'direct',
        messages
      }
    });
  };

  const changeFriend = async (friend) => {
    console.log('change friend', friend);
    if (friendRef.current.id === friend.id) return;
    friendRef.current = friend;
    friendsRef.current[friend.id].notifications -= friend.notifications;
    friend.notifications = 0;
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

  const changeRoom = async (room) => {
    if (state.view === 'room' && roomRef.current.id === room.id) return;
    roomRef.current = room;
    if (!messagesRef.current[room.id]) {
      socket.emit('to:server:change_room', room);
    } else {
      const channels = Object.values(channelsRef.current[room.id]);
      channelRef.current = channels[0];
      const channel = channelRef.current;
      roomsRef.current[room.id].notifications -= channel.notifications;
      channel.notifications = 0;
      const messages = messagesRef.current[room.id][channel.id].slice();
      const users = Object.values(usersRef.current[room.id]);
      view.current = 'room';
      dispatch({
        type: 'change_room',
        payload: {
          view: 'room',
          channels,
          messages,
          users
        }
      });
    }
  };

  const changeChannel = async (channel) => {
    if (channelRef.current.id === channel.id) return;
    channelRef.current = channel;
    const room = roomRef.current;
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

  const sendMessage = (e) => {
    e.preventDefault();
    if (!content) return;
    if (state.view === 'room') {
      socket.emit('to:server:send_message', {
        username: myuser.username,
        image: myuser.image,
        user_id: myuser.id,
        room_id: roomRef.current.id,
        channel_id: channelRef.current.id,
        content
      });
      setContent('');
    } else {
      socket.emit('to:server:direct:send_message', {
        username: myuser.username,
        image: myuser.image,
        user_id: myuser.id,
        room_id: friendRef.current.id,
        content
      });
      setContent('');
    }
  };

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const wsInitialize = async ({ wsRooms, wsChannels, wsFriends, wsUsers }) => {
    for (const friend of wsFriends) {
      friendsRef.current[friend.id] = friend;
      friend.notifications = 0;
    }
    console.log('friends', friendsRef.current);
    const friends = Object.values(friendsRef.current);
    friendRef.current = friends[0];

    for (const room of wsRooms) {
      roomsRef.current[room.id] = room;
      room.notifications = 0;
    }
    const rooms = Object.values(roomsRef.current);
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
    for (const user of wsUsers) {
      usersRef.current[room.id][user.id].online = true;
    }
    const users = Object.values(usersRef.current[room.id]);
    view.current = 'room';
    dispatch({
      type: 'initialize',
      payload: {
        view: 'room',
        rooms,
        channels,
        friends,
        messages,
        users
      }
    });
  };

  const wsReceiveMessage = (wsMessage) => {
    const room = roomRef.current;
    const channel = channelRef.current;
    if (room.id === wsMessage.room_id && channel.id === wsMessage.channel_id) {
      messagesRef.current[room.id][channel.id].push(wsMessage);
      const messages = messagesRef.current[room.id][channel.id].slice();
      dispatch({
        type: 'receive_message',
        payload: {
          messages
        }
      });
    } else {
      roomsRef.current[wsMessage.room_id].notifications++;
      const rooms = Object.values(roomsRef.current);
      channelsRef.current[wsMessage.room_id][wsMessage.channel_id].notifications++;
      if (room.id === wsMessage.room_id) {
        const channels = Object.values(channelsRef.current[wsMessage.room_id]);
        dispatch({
          type: 'update_notifications',
          payload: {
            rooms,
            channels
          }
        });
      } else {
        dispatch({
          type: 'update_room_notifications',
          payload: {
            rooms
          }
        });
      }
    }
  };

  const wsDirectReceiveMessage = (wsMessage) => {
    console.log('dude', friendsRef.current);
    if (view.current === 'room') {
      friendsRef.current[wsMessage.room_id].notifications++;
      if (messagesRef.current[wsMessage.room_id]) {
        console.log('testing wsdirect');
        messagesRef.current[wsMessage.room_id].push(wsMessage);
      }
    } else if (view.current === 'direct') {
      const friend = friendRef.current;
      if (friend.id === wsMessage.room_id) {
        messagesRef.current[friend.id].push(wsMessage);
        const messages = messagesRef.current[friend.id].slice();
        dispatch({
          type: 'direct_receive_message',
          payload: {
            messages
          }
        });
      } else {
        friendsRef.current[wsMessage.room_id].notifications++;
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

  const wsChangeRoom = async ({ wsRoom, wsUsers }) => {
    roomRef.current = wsRoom;
    const room = roomRef.current;
    const channels = Object.values(channelsRef.current[room.id]);
    channelRef.current = channels[0];
    const channel = channelRef.current;
    roomsRef.current[room.id].notifications -= channel.notifications;
    channel.notifications = 0;
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
    view.current = 'room';
    dispatch({
      type: 'change_room',
      payload: {
        view: 'room',
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
      socket.on('to:client:direct:receive_message', wsDirectReceiveMessage);
      socket.auth = myuser;
      socket.connect();
      return () => {
        socket.off('to:client:initialize', wsInitialize);
        socket.off('to:client:receive_message', wsReceiveMessage);
        socket.off('to:client:change_room', wsChangeRoom);
        socket.off('to:client:update_users', wsUpdateUsers);
        socket.off('to:client:direct:receive_message', wsDirectReceiveMessage);
      };
    }
  }, [socket, myuser])

  return (
    <div className={styles.container}>
      <Sidebar changeDirect={changeDirect} rooms={state.rooms} room={roomRef.current} changeRoom={changeRoom} />
      {state.view === 'room' ?
      <Room room={roomRef.current} channels={state.channels} channel={channelRef.current} changeChannel={changeChannel} content={content} updateContent={updateContent} messages={state.messages} sendMessage={sendMessage} users={state.users} /> :
      <Direct friends={state.friends} friend={friendRef.current} changeFriend={changeFriend} content={content} updateContent={updateContent} messages={state.messages} sendMessage={sendMessage} />}
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