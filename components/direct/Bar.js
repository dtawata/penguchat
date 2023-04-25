import styles from '@/styles/Bar.module.css';
import { signOut } from 'next-auth/react';

const Bar = (props) => {
  const { title, addFriend } = props;

  return (
    <div className={styles.container}>
      <h3># {title ? title.name : ''}</h3>
      <div onClick={addFriend} className={styles.add_friend}>Add Friend</div>
      <div onClick={signOut} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;