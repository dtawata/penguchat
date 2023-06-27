import styles from '@/styles/column2/Column2.module.css';
import Channels from './Channels';
import Friends from './Friends'
import MyUser from './MyUser';

const Column2 = (props) => {
  const { view, room, channels, channel, friends, friend, myUser } = props;
  const { changeChannel, changeFriend, updateModal } = props;

  return (
    <div className={styles.container}>
      {view === 'room' ?
      <Channels myUser={myUser} room={room} channels={channels} channel={channel} changeChannel={changeChannel} updateModal={updateModal} /> :
      <Friends friends={friends} friend={friend} changeFriend={changeFriend} updateModal={updateModal} />}
      <MyUser myUser={myUser} />
    </div>
  );
};

export default Column2;