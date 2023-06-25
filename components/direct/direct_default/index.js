import styles from '@/styles/DirectDefault.module.css';
import Bar from './Bar';
import Default from './Default';
import AddFriend from './AddFriend';
import Online from './Online';
import Requests from './Requests';

const DirectDefault = (props) => {
  const {directView, friends, requests, invites} = props;
  const {updateDirectView, updateAddFriend, changeFriend, addFriend, sendFriendRequest, respondRoomInvite, respondFriendRequest, updateModal } = props;

  return (
    <div className={styles.container}>
      <Bar updateDirectView={updateDirectView} updateAddFriend={updateAddFriend} />
      <div className={styles.flex}>
        {directView === 'all' && <Default friends={friends} changeFriend={changeFriend} addFriend={addFriend} sendFriendRequest={sendFriendRequest} />}
        {directView === 'add' && <AddFriend sendFriendRequest={sendFriendRequest} />}
        {directView === 'online' && <Online friends={friends} changeFriend={changeFriend} addFriend={addFriend} sendFriendRequest={sendFriendRequest} />}
        {directView === 'pending' && <Requests requests={requests} invites={invites} respondRoomInvite={respondRoomInvite} sendFriendRequest={sendFriendRequest} respondFriendRequest={respondFriendRequest} addFriend={addFriend} updateModal={updateModal} />}
      </div>
    </div>
  );
};

export default DirectDefault;