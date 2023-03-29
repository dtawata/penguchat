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

const Home = () => {

  const [state, dispatch] = useReducer(reducer, { count: 0 });

  const change = () => {
    dispatch({
      type: 'decrement'
    });
  };

  return (
    <div className={styles.container}>
      <div onClick={change}>{state.count}</div>
      <Group />
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