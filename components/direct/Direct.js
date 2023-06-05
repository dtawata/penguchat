import styles from '@/styles/Direct.module.css';
import { Fragment, useState } from 'react';
import Chat from './Chat';
import Bar from './Bar';
import Bar2 from './Bar2';
import Friends from './Friends';
import Default from './Default';
import Online from './Online';
import Requests from './Requests';

const Direct = (props) => {
  const { myUser, friends, friend, messages, content, requests, invites } = props;
  const { changeFriend, sendMessage, updateContent, sendFriendRequest, respondFriendRequest, respondRoomInvite, updateModal } = props;

  const [directView, setDirectView] = useState('all');
  const [addFriend, setAddFriend] = useState(false);

  const updateDirectView = (view) => {
    setDirectView(view);
  };

  const updateAddFriend = () => {
    setAddFriend(!addFriend);
  };

  return (
    <Fragment>
      <Friends myUser={myUser} friends={friends} friend={friend} changeFriend={changeFriend} updateModal={updateModal} />
      {friend.id === 'default' ?
      <div className={styles.main}>
        <Bar updateDirectView={updateDirectView} updateAddFriend={updateAddFriend} />
        <div className={styles.flex}>
          {directView === 'all' && <Default friends={friends} changeFriend={changeFriend} addFriend={addFriend} sendFriendRequest={sendFriendRequest} />}
          {directView === 'online' && <Online friends={friends} changeFriend={changeFriend} addFriend={addFriend} sendFriendRequest={sendFriendRequest} />}
          {directView === 'pending' && <Requests requests={requests} invites={invites} respondRoomInvite={respondRoomInvite} sendFriendRequest={sendFriendRequest} respondFriendRequest={respondFriendRequest} addFriend={addFriend} updateModal={updateModal} />}
        </div>
      </div> :
      <div className={styles.main}>
        <Bar2 friend={friend} />
        <div className={styles.flex}>
          <Chat content={content} updateContent={updateContent} messages={messages} sendMessage={sendMessage} />
        </div>
      </div>}
    </Fragment>
  );
};

export default Direct;