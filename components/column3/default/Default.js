import styles from '@/styles/column3/default/Default.module.css';
import { useState } from 'react';
import Image from 'next/image';

const Default = (props) => {
  const { friends, addFriend } = props;
  const { changeFriend, sendFriendRequest } = props;

  return (
    <div className={styles.container}>
      <div className={styles.friends}>
        <h3 className={styles.friends_count}>All Friends - {friends.length}</h3>
        {friends.map((friend) => {
          return <Friend friend={friend} changeFriend={changeFriend} key={friend.id} />
        })}
      </div>
    </div>
  )
};

const Friend = (props) => {
  const { friend } = props;
  const { changeFriend } = props;

  return (
    <div onClick={() => { changeFriend(friend.id); }} className={styles.friend}>
      <Image className={styles.friend_img} src={`https://penguchat-users.s3.amazonaws.com/${friend.image}`} alt='' width='40' height='40' />
      <div className={styles.friend_right}>
        <div className={styles.friend_username}>{friend.username}</div>
        <div className={styles.friend_status}>{friend.online ? 'Online' : 'Offline'}</div>
      </div>
    </div>
  );
};

export default Default;