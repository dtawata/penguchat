import styles from '@/styles/Home.module.css'
import Direct from '@/components/direct/Direct';
import Group from '@/components/group/Group';
import { getUser } from '../lib/mysql';
import { getSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect, useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const Home = (props) => {
  const { session, user } = props;

  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    messages: [],
    rooms: [{
      id: '001',
      name: 'First Channel',
      img: '/img/default.jpg'
    },{
      id: '002',
      name: 'Second Room',
      img: '/img/default.jpg'
    },{
      id: '003',
      name: 'Third Room',
      img: '/img/default.jpg'
    },{
      id: '004',
      name: 'Fourth Room',
      img: '/img/default.jpg'
    }],
    channels: [{
      id: '001',
      name: 'First Channel'
    },{
      id: '002',
      name: 'Second Channel'
    },{
      id: '003',
      name: 'Third Channel'
    },{
      id: '004',
      name: 'Fourth Channel'
    },{
      id: '005',
      name: 'Fifth Channel'
    }]
  });

  const [content, setContent] = useState('');


  // const [socket, setSocket] = useState(null);
  // const group = useRef({});
  // const direct = useRef({
  //   messages: {},
  //   users: {}
  // });
  // const [state, dispatch] = useReducer(reducer, {
  //   view: 'group',
  //   direct: {
  //     notifications: 0
  //   },
  //   rooms: [],
  //   room: {},
  //   channels: [],
  //   channel: {},
  //   friends: [],
  //   friend: {},
  //   messages: [],
  //   users: []
  // });

  const change = () => {
    dispatch({
      type: 'decrement'
    });
  };

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Group state={state} content={content} updateContent={updateContent} />
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