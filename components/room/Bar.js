import styles from '@/styles/Bar.module.css';
import { signOut } from 'next-auth/react';

const Bar = (props) => {
  const { channel } = props;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}># {channel.name}</h3>
      <div onClick={signOut} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;