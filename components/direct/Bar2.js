import styles from '@/styles/Bar2.module.css';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

const Bar = (props) => {
  const { friend } = props;

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <Image className={styles.image} src={friend.image} alt='' width='25' height='25' />
        <div className={styles.username}>{friend.username}</div>
      </div>
      <div onClick={signOut} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;