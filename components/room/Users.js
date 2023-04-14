import styles from '@/styles/Users.module.css';

const Users = (props) => {
  const { users } = props;

  return (
    <div className={styles.container}>
      <div>Online</div>
      {users.map((user) => {
        if (user.online) {
          return <Online user={user} key={user.id} />
        }
       })}
       <br/>
       <div>Offline</div>
       {users.map((user) => {
        if (!user.online) {
          return <Offline user={user} key={user.id} />
        }
       })}
    </div>
  );
};

const Online = (props) => {
  const { user } = props;
  return (
    <div className={styles.user}>{user.username}</div>
  );
};

const Offline = (props) => {
  const { user } = props;

  return (
    <div className={styles.user}>{user.username}</div>
  );
};

export default Users;