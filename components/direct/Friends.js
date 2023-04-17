import styles from '@/styles/Friends.module.css';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';

const Friends = (props) => {
  const { friends, friend, changeFriend } = props;
  const selected = friend.id;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <h3>Friends</h3>
      </div>
      <div className={styles.friends}>
        {friends.map((friend) => {
          return <Friend friend={friend} selected={selected} changeFriend={changeFriend} key={friend.id} />
        })}
      </div>
    </div>
  );
};

const Friend = (props) => {
  const { friend, selected, changeFriend } = props;

  return (
    <Fragment>
      {friend.id === selected ?
      <div onClick={() => { changeFriend(friend); }} className={`${styles.friend} ${styles.active}`}>
        <FontAwesomeIcon icon={faHashtag} className={styles.friend_icon} />
        <div className={styles.friend_text}>{friend.username} {friend.notifications !== 0 && friend.notifications}</div>
      </div> :
      <div onClick={() => { changeFriend(friend); }} className={styles.friend}>
        <FontAwesomeIcon icon={faHashtag} className={styles.friend_icon} />
        <div className={styles.friend_text}>{friend.username} {friend.notifications !== 0 && friend.notifications}</div>
      </div>}
    </Fragment>
  );
};

export default Friends