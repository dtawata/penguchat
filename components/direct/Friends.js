import styles from '@/styles/Friends.module.css';
import { Fragment } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import MyUser from '@/components/MyUser';

const Friends = (props) => {
  const { myUser, friends, friend, changeFriend, updateModal } = props;
  const selected = friend.id;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div onClick={() => { updateModal(true); }} className={styles.input}>Find or start a conversation</div>
      </div>
      <div className={styles.friends}>
        {selected === 'default' ?
        <div className={`${styles.default} ${styles.active}`}>
          <FontAwesomeIcon icon={faUser} className={styles.default_icon} />
          <div className={styles.default_text}>Friends</div>
        </div> :
        <div onClick={() => { changeFriend('default'); }} className={styles.default}>
          <FontAwesomeIcon icon={faUser} className={styles.default_icon} />
          <div className={styles.default_text}>Friends</div>
        </div>}
        <div className={styles.title}>Direct Messages</div>
        {friends.map((friend) => {
          if (friend.id === selected) return <Selected friend={friend} key={friend.id} />
          return <Friend friend={friend} changeFriend={changeFriend} key={friend.id} />
        })}
      </div>
      <MyUser myUser={myUser} />
    </div>
  );
};

const Friend = (props) => {
  const { friend, changeFriend } = props;
  const css = friend.online ? `${styles.friend} ${styles.online}` : styles.friend;

  return (
    <div onClick={() => { changeFriend(friend.id); }} className={css}>
      <div className={styles.friend_left}>
        <Image className={styles.friend_img} src={`https://penguchat-users.s3.amazonaws.com/${friend.image}`} alt='' width='30' height='30' />
        <div className={styles.friend_bubble}>
          <div className={styles.friend_bubble_color}></div>
        </div>
      </div>
      <div className={styles.friend_right}>
        <div className={styles.friend_username}>{friend.username}</div>
        {friend.notifications !== 0 && <div className={styles.friend_notifications}>{friend.notifications}</div>}
      </div>
    </div>
  );
};

const Selected = (props) => {
  const { friend } = props;
  const css = friend.online ? `${styles.friend} ${styles.online} ${styles.active}` : `${styles.friend} ${styles.active}`;

  return (
    <div className={css}>
      <div className={styles.friend_left}>
        <Image className={styles.friend_img} src={`https://penguchat-users.s3.amazonaws.com/${friend.image}`} alt='' width='30' height='30' />
        <div className={styles.friend_bubble}>
          <div className={styles.friend_bubble_color}></div>
        </div>
      </div>
      <div className={styles.friend_right}>
        <div className={styles.friend_username}>{friend.username}</div>
        {!!friend.notifications && <div className={styles.friend_notifications}>{friend.notifications}</div>}
      </div>
    </div>
  );
};

export default Friends