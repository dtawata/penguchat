import styles from '@/styles/Default.module.css';
import { useState } from 'react';
import Image from 'next/image';

const Default = (props) => {
  const { friends, addFriend } = props;
  const { changeFriend, sendFriendRequest } = props;

  const [content, setContent] = useState('');

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const submitContent = (e) => {
    e.preventDefault();
    const username = content;
    setContent('');
    sendFriendRequest(username);
  };

  return (
    <div className={styles.container}>
      {addFriend &&
      <div className={styles.add_friend}>
        <h3 className={styles.title}>Add Friend</h3>
        <form onSubmit={submitContent} className={styles.form}>
          <input onChange={updateContent} className={styles.input} type='text' value={content} />
        </form>
      </div>}
      <div className={styles.friends}>
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
      <Image className={styles.friend_img} src='/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg' alt='' width='40' height='40' />
      <div className={styles.friend_right}>
        <div className={styles.friend_username}>{friend.username}</div>
        <div className={styles.friend_status}>{friend.online ? 'Online' : 'Offline'}</div>
      </div>
    </div>
  );
};

export default Default;