import styles from '@/styles/Login.module.css';
import React, { useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';

const Login = (props) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    callbackUrl: 'http://ec2-3-95-38-165.compute-1.amazonaws.com'
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const temp = await signIn('credentials', credentials);
    } catch(error) {
      console.log('login.js error', error.response.data);
    }
  };

  const handleChange = (e) => {
    setCredentials(() => {
      return {
        ...credentials,
        [e.target.name]: e.target.value
      };
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Welcome Back!</h2>
        <input onChange={handleChange} className={styles.input} name='username' type='text' placeholder='Username' required />
        <input onChange={handleChange} className={styles.input} name='password' type='password' placeholder='Password' required />
        <button className={styles.button}>Sign In</button>
        <Link className={styles.link} href='/register' passHref>Register</Link>
      </form>
    </div>
  );
};

export default Login;


export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};