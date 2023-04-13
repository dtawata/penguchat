import styles from '@/styles/Users.module.css';

//   const { users, changeView } = props;


// const User = (props) => {
//   const { user, changeView } = props;

//   return (
//     <div onClick={() => {changeView(user); }} className={styles.user}>{user.username}</div>
//   );
// };

// const Offline = (props) => {
//   const { user, changeView } = props;

//   return (
//     <div onClick={() => {changeView(user); }} className={styles.user}>{user.username}</div>
//   );
// };

const Users = (props) => {
  const { users } = props;

  return (
    <div className={styles.container}>
      <div>Online</div>
      {users.map((user) => {
        if (user.online) {
          // return <User user={user} changeView={changeView} key={user.id} />
          return <div key={user.id}>{user.username}</div>
        }
       })}
       <br/>
       <div>Offline</div>
       {users.map((user) => {
        if (!user.online) {
          // return <Offline user={user} changeView={changeView} key={user.id} />
          return <div key={user.id}>{user.username}</div>
        }
       })}
    </div>
  );
};

export default Users;