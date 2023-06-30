import styles from '@/styles/column3/Users.module.css';
import Image from 'next/image';

const Users = (props) => {
  const { users, changeFriend } = props;

  return (
    <div className={styles.container}>
      <div className={styles.users}>
        <h3 className={styles.title_online}>Online</h3>
        {users.map((user) => {
          if (user.online) return <Online user={user} changeFriend={changeFriend} key={user.id} />
        })}
        <h3 className={styles.title_offline}>Offline</h3>
        {users.map((user) => {
          if (!user.online) return <Offline user={user} changeFriend={changeFriend} key={user.id} />
        })}
      </div>
    </div>
  );
};

const Online = (props) => {
  const { user, changeFriend } = props;
  const css = user.online ? `${styles.user} ${styles.online}` : styles.user;

  return (
    <div className={css}>
      <div className={styles.user_left}>
        <Image className={styles.user_img} src={`https://penguchat-users.s3.amazonaws.com/${user.image}`} alt='' width='30' height='30' />
        <div className={styles.user_bubble}>
          <div className={styles.user_bubble_color}></div>
        </div>
      </div>
      <div className={styles.user_text}>{user.username}</div>
    </div>
  );
};

const Offline = (props) => {
  const { user } = props;
  const css = user.online ? `${styles.user} ${styles.online}` : styles.user;

  return (
    <div className={css}>
      <div className={styles.user_left}>
        <Image className={styles.user_img} src={`https://penguchat-users.s3.amazonaws.com/${user.image}`} alt='' width='30' height='30' />
        <div className={styles.user_bubble}>
          <div className={styles.user_bubble_color}></div>
        </div>
      </div>
      <div className={styles.user_text}>{user.username}</div>
    </div>
  );
};

export default Users;