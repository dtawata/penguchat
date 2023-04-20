import styles from '@/styles/Default.module.css';
import Image from 'next/image';

const Default = (props) => {
  const { friends, changeFriend } = props;

  return (
    <div className={styles.container}>
      <div className={styles.friends}>
        {friends.map((friend) => {
          return <Friend friend={friend} changeFriend={changeFriend} key={friend.id} />
        })}
      </div>
    </div>
  )
};

const Friend = (props) => {
  const { friend, changeFriend } = props;

  return (
    <div onClick={() => { changeFriend(friend); }} className={styles.friend}>
      <Image className={styles.friend_img} src='/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg' alt='' width='40' height='40' />
      <div className={styles.friend_right}>
        <div className={styles.friend_username}>{friend.username}</div>
        <div className={styles.friend_status}>{friend.online ? 'Online' : 'Offline'}</div>
      </div>
    </div>
  );
};

export default Default;