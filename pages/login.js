import styles from '@/styles/Login.module.css';
import React, { useEffect, useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = (props) => {
  const { push } = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    error: '',
    redirect: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    signIn('credentials', credentials).then(({ error, ok }) => {
      if (ok) {
        push('/');
      } else {
        setCredentials({ ...credentials, error });
      }
    });
  };

  const handleChange = (e) => {
    setCredentials(() => {
      return {
        ...credentials,
        [e.target.name]: e.target.value
      };
    });
  };

  const createDemo = async () => {
    const random = Math.floor(Math.random() * 100000000);
    const demoCredentials = {
      email: `demo-${random}@gmail.com`,
      username: `demo-${random}`,
      password: 'password',
      fname: `demo-${random}`,
      lname: `demo-${random}`,
      demo: true
    };
    const user = await axios.post('/api/auth/register', demoCredentials);
    const temp = {
      username: demoCredentials.username,
      password: demoCredentials.password
    }
    await signIn('credentials', temp);
  };

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div className={styles.logo}>penguchat</div>
        <div className={styles.options}>
          <div className={`${styles.option} ${styles.active}`}>Log In</div>
          <div className={styles.option}><Link className={styles.option_link} href='/register' passHref>Sign Up</Link></div>
        </div>
      </div>
      <div className={styles.login}>
        <button onClick={createDemo} className={styles.demo}>Try a demo account for quick access!</button>
        <h3 className={styles.title}>Welcome back!</h3>
        <div className={styles.subtitle}>Were so excited to see you again!</div>
        <div className={styles.error}>{credentials.error}</div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label} htmlFor='username'>Email or Username <span className={styles.asterisk}>*</span></label>
          <input onChange={handleChange} className={styles.input} id='username' name='username' type='text' value={credentials.username} placeholder='Username' required />
          <label className={styles.label} htmlFor='password'>Password <span className={styles.asterisk}>*</span></label>
          <input onChange={handleChange} className={styles.input} id='password' name='password' type='password' value={credentials.password} placeholder='Password' required />
          <button className={styles.button}>Log In</button>
        </form>
        <div className={styles.register}>Need an account? <Link className={styles.link} href='/register' passHref>Register</Link></div>
      </div>
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
