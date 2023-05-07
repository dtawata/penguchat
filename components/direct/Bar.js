import styles from '@/styles/Bar.module.css';
import { signOut } from 'next-auth/react';

const Bar = (props) => {
  const { addFriend, updateDirectView } = props;

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div className={styles.option}>Online</div>
        <div className={styles.option}>All</div>
        <div onClick={() => { updateDirectView('pending'); }} className={styles.option}>Pending</div>
        <div onClick={addFriend} className={styles.add_friend}>Add Friend</div>
      </div>
      <div onClick={signOut} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;