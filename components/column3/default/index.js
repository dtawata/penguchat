import styles from '@/styles/column3/default/DirectDefault.module.css';
import { useState } from 'react';
import Bar from './Bar';
import Default from './Default';
import AddFriend from './AddFriend';
import Online from './Online';
import Requests from './Requests';

const DirectDefault = (props) => {
  const {friends, requests, invites} = props;
  const { changeFriend, sendFriendRequest, respondRoomInvite, respondFriendRequest, updateModal, openSidebar } = props;

  const [directView, setDirectView] = useState('all');
  const [addFriend, setAddFriend] = useState(false);

  const updateDirectView = (view) => {
    setDirectView(view);
  };

  const updateAddFriend = () => {
    setAddFriend(!addFriend);
  };

  return (
    <div className={styles.container}>
      <Bar openSidebar={openSidebar} updateDirectView={updateDirectView} updateAddFriend={updateAddFriend} />
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