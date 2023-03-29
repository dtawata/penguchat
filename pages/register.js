import styles from '@/styles/Register.module.css';
import React, { useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import axios from 'axios';

const Register = (props) => {
  const [credentials, setCredentials] = useState({
    email: '',
    username: '',
    password: '',
    fname: '',
    lname: ''
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios.post('/api/auth/register', credentials);
      signIn('credentials', {
        username: credentials.username,
        password: credentials.password
      });
    } catch(error) {
      console.error('register.js error', error.response.data);
    }
  };

  const handleChange = (e) => {
    setCredentials((prevCredentials) => {
      return {
        ...prevCredentials,
        [e.target.name]: e.target.value
      };
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create an Account</h2>
        <input onChange={handleChange} className={styles.input} name='email' type='text' placeholder='Email' required />
        <input onChange={handleChange} className={styles.input} name='fname' type='text' placeholder='First Name' required />
        <input onChange={handleChange} className={styles.input} name='lname' type='text' placeholder='Last Name' required />
        <input onChange={handleChange} className={styles.input} name='username' type='text' placeholder='Username' required />
        <input onChange={handleChange} className={styles.input} name='password' type='password' placeholder='Password' required />
        <button className={styles.button}>Sign Up</button>
        <Link href='/login' passHref>Login</Link>
      </form>
    </div>
  );
};

export default Register;

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