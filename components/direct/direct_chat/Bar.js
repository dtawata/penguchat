import styles from '@/styles/Bar2.module.css';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
const Bar = (props) => {
  const { friend } = props;
  const { openSidebar } = props;

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div onClick={openSidebar} className={styles.toggle}>
          <FontAwesomeIcon icon={faBars} className={styles.icon} />
        </div>
        <Image className={styles.image} src={`https://penguchat-users.s3.amazonaws.com/${friend.image}`} alt='' width='25' height='25' />
        <div className={styles.username}>{friend.username}</div>
      </div>
      <div onClick={() => { signOut({ callbackUrl: '/login' }); }} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;