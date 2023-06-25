import styles from '@/styles/Default.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const Online = (props) => {
  const { friends, addFriend } = props;
  const { changeFriend, sendFriendRequest } = props;

  const [content, setContent] = useState('');
  const [count, setCount] = useState(0);

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const submitContent = (e) => {
    e.preventDefault();
    const username = content;
    setContent('');
    sendFriendRequest(username);
  };

  useEffect(() => {
    let temp = 0;
    friends.forEach((friend) => {
      friend.online && temp++;
    });
    setCount(temp);
  }, [friends])

  return (
    <div className={styles.container}>
      <div className={styles.friends}>
        <h3 className={styles.friends_count}>Online - {count}</h3>
        {friends.map((friend) => {
          if (friend.online) return <Friend friend={friend} changeFriend={changeFriend} key={friend.id} />
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

export default Online;