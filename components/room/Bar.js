import styles from '@/styles/Bar.module.css';
import { signOut } from 'next-auth/react';

const Bar = (props) => {
  const { channel, openSidebar } = props;

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div onClick={openSidebar} className={styles.toggle}>Toggle</div>
        <h3 className={styles.title}># {channel.name}</h3>
      </div>
      <div onClick={() => { signOut({ callbackUrl: '/login' }); }} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;