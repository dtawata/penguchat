import styles from '@/styles/Bar.module.css';
import { signOut } from 'next-auth/react';

const Bar = (props) => {
  const { updateDirectView, updateAddFriend } = props;

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div onClick={() => { updateDirectView('online'); }} className={styles.option}>Online</div>
        <div onClick={() => { updateDirectView('all'); }} className={styles.option}>All</div>
        <div onClick={() => { updateDirectView('pending'); }} className={styles.option}>Pending</div>
        <div onClick={updateAddFriend} className={styles.add_friend}>Add Friend</div>
      </div>
      <div onClick={() => { signOut({ callbackUrl: '/login' }); }} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;