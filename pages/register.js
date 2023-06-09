import styles from '@/styles/Register.module.css';
import React, { useState, useRef } from 'react';
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

  const [dob, setDob] = useState({ year: null, month: null, date: null });

  const handleSelect = (e) => {
    console.log(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await axios.post('/api/auth/register', credentials);
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

  const createDemo = async () => {
    const random = Math.floor(Math.random() * 100000000);
    const demoCredentials = {
      email: `demo-${random}@gmail.com`,
      username: `demo-${random}`,
      password: 'password',
      fname: `demo-${random}`,
      lname: `demo-${random}`
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
          <div className={styles.option}><Link className={styles.option_link} href='/login' passHref>Log In</Link></div>
          <div className={`${styles.option} ${styles.active}`}>Sign Up</div>
        </div>
      </div>
      <div className={styles.login}>
        <button onClick={createDemo} className={styles.demo}>Try a demo account for quick access!</button>
        <h3 className={styles.title}>Create an account</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label} htmlFor='email'>Email</label>
          <input onChange={handleChange} className={styles.input} id='email' name='email' type='text' value={credentials.email} placeholder='' required />
          <label className={styles.label} htmlFor='fname'>First Name</label>
          <input onChange={handleChange} className={styles.input} id='fname' name='fname' type='text' value={credentials.fname} placeholder='' required />
          <label className={styles.label} htmlFor='lname'>Last Name</label>
          <input onChange={handleChange} className={styles.input} id='lname' name='lname' type='text' value={credentials.lname} placeholder='' required />
          <label className={styles.label} htmlFor='username'>Username</label>
          <input onChange={handleChange} className={styles.input} id='username' name='username' type='text' value={credentials.username} placeholder='' required />
          <label className={styles.label} htmlFor='password'>Password</label>
          <input onChange={handleChange} className={styles.input} id='password' name='password' type='password' value={credentials.password} placeholder='' required />
          <label className={styles.label}>Date of Birth</label>
          <div className={styles.dob}>
            <select onChange={handleSelect} className={styles.select}>
              <option value='January'>January</option>
              <option value='February'>February</option>
              <option value='March'>March</option>
              <option value='April'>April</option>
              <option value='May'>May</option>
              <option value='June'>June</option>
              <option value='July'>July</option>
              <option value='August'>August</option>
              <option value='September'>September</option>
              <option value='October'>October</option>
              <option value='November'>November</option>
              <option value='December'>December</option>
            </select>
            <select className={styles.select}>
              {Array.from({ length: 31 }).map((item, index) => {
                return <option value={index + 1} key={index + 1}>{index + 1}</option>
              })}
            </select>
            <select className={styles.select}>
              {Array.from({ length: 150 }).map((item, index) => {
                return <option value={new Date().getFullYear() - index} key={index}>{new Date().getFullYear() - index}</option>
              })}
            </select>
          </div>
          <button className={styles.button}>Sign Up</button>
        </form>
        <div className={styles.register}><Link className={styles.link} href='/login' passHref>Already have an account?</Link></div>
      </div>
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
