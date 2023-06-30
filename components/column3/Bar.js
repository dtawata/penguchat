import styles from '@/styles/column3/Bar.module.css';
import { Fragment } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHashtag } from '@fortawesome/free-solid-svg-icons';

const Bar = (props) => {
  const { view, channel, friend } = props;
  const { openSidebar } = props;

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div onClick={openSidebar} className={styles.toggle}>
          <FontAwesomeIcon icon={faBars} className={styles.toggle_icon} />
        </div>
        {view === 'room' &&
        <Fragment>
          <FontAwesomeIcon icon={faHashtag} className={styles.icon} />
          <h3 className={styles.title}>{channel.name}</h3>
        </Fragment>}
        {view === 'direct' &&
        <Fragment>
          <Image className={styles.image} src={`https://penguchat-users.s3.amazonaws.com/${friend.image}`} alt='' width='25' height='25' />
          <h3 className={styles.title}>{friend.username}</h3>
        </Fragment>}
      </div>
      <div onClick={() => { signOut({ callbackUrl: '/login' }); }} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;

