import styles from '@/styles/column3/default/Bar.module.css';
import { signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Bar = (props) => {
  const { updateDirectView, openSidebar, updateAddFriend } = props;

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div onClick={openSidebar} className={styles.toggle}>
          <FontAwesomeIcon icon={faBars} className={styles.toggle_icon} />
        </div>
        <div onClick={() => { updateDirectView('online'); }} className={styles.option}>Online</div>
        <div onClick={() => { updateDirectView('all'); }} className={styles.option}>All</div>
        <div onClick={() => { updateDirectView('pending'); }} className={styles.option}>Pending</div>
        <div onClick={() => { updateDirectView('add'); }} className={styles.add_friend}>Add Friend</div>
      </div>
      <div onClick={() => { signOut({ callbackUrl: '/login' }); }} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;