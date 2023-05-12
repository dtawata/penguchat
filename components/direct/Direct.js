import styles from '@/styles/Direct.module.css';
import { Fragment, useState } from 'react';
import Chat from './Chat';
import Bar from './Bar';
import Friends from './Friends';
import Default from './Default';
import Pending from './Pending';

const Direct = (props) => {
  const { myUser, friends, friend, messages, content, requests, invites } = props;
  const { changeFriend, sendMessage, updateContent, sendFriendRequest, sendFriendResponse, respondRoomInvite, updateModal } = props;

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
          {directView === 'all' ?
          <Default friends={friends} changeFriend={changeFriend} addFriend={addFriend} sendFriendRequest={sendFriendRequest} /> :
          <Pending requests={requests} invites={invites} respondRoomInvite={respondRoomInvite} sendFriendRequest={sendFriendRequest} sendFriendResponse={sendFriendResponse} addFriend={addFriend} updateModal={updateModal} />}
        </div>
      </div> :
      <div className={styles.main}>
        <Bar updateDirectView={updateDirectView} />
        <div className={styles.flex}>
          <Chat content={content} updateContent={updateContent} messages={messages} sendMessage={sendMessage} />
        </div>
      </div>}
    </Fragment>
  );
};

const Test = (props) => {
  const { myUser, friends, friend, changeFriend, content, updateContent, messages, sendMessage, updateModal, users, sendFriendRequest, updateFriendContent, friendContent, addFriend, updateDirectView, friendsSetting, directView } = props;

  return (
    <Fragment>
    {directView === 'all' ?
      <div className={styles.main}>
        <Bar addFriend={addFriend} updateDirectView={updateDirectView} />
        <div className={styles.flex}>
          <Default friends={friends} changeFriend={changeFriend} friendsSetting={friendsSetting} friendContent={friendContent} updateFriendContent={updateFriendContent} sendFriendRequest={sendFriendRequest} />
        </div>
      </div> :
      <div className={styles.main}>
        <Bar addFriend={addFriend} updateDirectView={updateDirectView} />
        <div className={styles.flex}>
          <div>Hello</div>
          {/* <Default friends={friends} changeFriend={changeFriend} friendsSetting={friendsSetting} friendContent={friendContent} updateFriendContent={updateFriendContent} sendFriendRequest={sendFriendRequest} /> */}
        </div>
      </div>}
    </Fragment>
  );
}
export default Direct;