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
import CreateGroup from '@/components/CreateGroup';
import CreateChannel from '@/components/CreateChannel';
import { initializeFriends, getDirectMessages, initializeRooms, initializeChannels, updateFriendsStatus, updateRoomsChannels, getMessages, getUsers } from '@/lib/helper/helper';

const reducer = (state, action) => {
  const { view, rooms, room, channels, channel, friends, friend, messages, users, requests, modal, create } = action.payload;
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
        friends,
        friend
      };
    }
    case 'change_create': {
      return {
        ...state,
        create
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
    create: false,
    modal: false,
    rooms: [],
    room: { id: null },
    channels: [],
    channel: { id: null },
    friends: [],
    friend: { id: null },
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
  const [groupContent, setGroupContent] = useState('');

  // const [state, setState, changeChannel, wsChangeDirect, changeRoom, wsChangeRoom, wsReceiveRoomMessage, wsReceiveDirectMessage, wsReceiveFriendRequest, wsReceiveFriendRequestResponse, wsUpdateUsers, wsUpdateFriends, changeDirect, changeFriend] = useSave({
  //   view: 'room',
  //   modal: false,
  //   rooms: [],
  //   room: {},
  //   channels: [],
  //   channel: {},
  //   friends: [],
  //   messages: [],
  //   users: []
  // }, socket);

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

  const wsInitialize = async ({ wsRooms, wsChannels, wsFriends, userIds, requests }) => {
    const friends = initializeFriends(wsFriends, friendsRef);
    const friend = friendRef.current = { id: 'default' };
    const rooms = initializeRooms(wsRooms, roomsRef);
    const room = roomRef.current = rooms[0];
    const channels = initializeChannels(wsChannels, channelsRef, room.id);
    const channel = channelRef.current = channels[0];
    const messages = await getMessages({ room_id: room.id, channel_id: channel.id, messagesRef });
    const users = await getUsers({ room_id: room.id, usersRef, userIds });
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
        requests
      }
    });
  };

  const wsChangeDirect = ({ wsFriends }) => {
    usersRef.current.direct = true;
    const friends = updateFriendsStatus(wsFriends, friendsRef);
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
    const { rooms, room, channels, channel } = updateRoomsChannels({ roomsRef, roomRef, channelsRef, channelRef, room_id });
    const messages = await getMessages({ messagesRef, room_id: room.id, channel_id: channel.id });
    const users = await getUsers({ messagesRef, room_id: room.id, channel_id: channel.id, usersRef, userIds });
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

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const updateFriendContent = (e) => {
    setFriendContent(e.target.value);
  };

  const updateGroupContent = (e) => {
    setGroupContent(e.target.value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!content) return;
    if (state.view === 'room') {
      socket.emit('to:server:room:send_message', {
        username: myuser.username,
        image: myuser.image,
        user_id: myuser.id,
        room_id: state.room.id,
        channel_id: state.channel.id,
        content
      });
    } else {
      socket.emit('to:server:direct:send_message', {
        username: myuser.username,
        image: myuser.image,
        user_id: myuser.id,
        room_id: state.friend.id,
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
      socket.on('to:client:create_room', wsCreateRoom);
      socket.on('to:client:create_channel', wsCreateChannel);
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
        socket.off('to:client:create_room', wsCreateRoom);
        socket.off('to:client:create_channel', wsCreateChannel);
      };
    }
  }, [socket, myuser])

  const createGroup = async (e) => {
    e.preventDefault();
    socket.emit('to:server:create_room', {
      myuser: myuser,
      room_name: groupContent
    });
  };

  const wsCreateRoom = ({ wsRoom, wsChannel }) => {
    const rooms = initializeRooms([wsRoom], roomsRef);
    const room = roomRef.current = roomsRef.current[wsRoom.id];
    const channels = initializeChannels([wsChannel], channelsRef, room.id);
    const channel = channelRef.current = channels[0];
    messagesRef.current[wsRoom.id] = {};
    const messages = messagesRef.current[wsRoom.id][channel.id] = [];
    const user = {
      id: myuser.id,
      username: myuser.username,
      image: myuser.image,
      online: true
    };
    const users = [user];
    usersRef.current[wsRoom.id] = {
      [user.id]: user
    };
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

  const [channelContent, setChannelContent] = useState('');
  const updateChannelContent = (e) => {
    setChannelContent(e.target.value);
  };

  const createChannel = async (e) => {
    e.preventDefault();
    socket.emit('to:server:create_channel', {
      room_id: state.room.id,
      channel_name: channelContent
    });
    setChannelContent('');
  };

  const updateModal = (status) => {
    dispatch({
      type: 'update_modal',
      payload: {
        modal: status
      }
    });
  };

  const wsCreateChannel = (channel) => {
    const channels = initializeChannels([channel], channelsRef, channel.room_id);
    dispatch({
      type: 'create_channel',
      payload: {
        modal: false,
        channels
      }
    });
  };

  return (
    <div className={styles.container}>
      <Sidebar changeDirect={changeDirect} rooms={state.rooms} room={state.room} changeRoom={changeRoom} updateModal={updateModal} />
      {state.view === 'room' ?
      <Room myuser={myuser} room={state.room} channels={state.channels} channel={state.channel} changeChannel={changeChannel} content={content} updateContent={updateContent} messages={state.messages} sendMessage={sendMessage} users={state.users} changeFriend={changeFriend} updateModal={updateModal} /> :
      <Direct myuser={myuser} friends={state.friends} friend={state.friend} changeFriend={changeFriend} content={content} updateContent={updateContent} messages={state.messages} sendMessage={sendMessage} updateModal={updateModal} users={state.users} sendFriendRequest={sendFriendRequest} friendContent={friendContent} updateFriendContent={updateFriendContent} />}
      {state.modal === 'notification' && <Modal requests={state.requests} updateModal={updateModal} sendFriendRequestResponse={sendFriendRequestResponse} />}
      {state.modal === 'room' && <CreateGroup createGroup={createGroup} groupContent={groupContent} updateGroupContent={updateGroupContent} updateModal={updateModal} />}
      {state.modal === 'channel' && <CreateChannel createChannel={createChannel} channelContent={channelContent} updateChannelContent={updateChannelContent} updateModal={updateModal} />}
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