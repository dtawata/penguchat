import styles from '@/styles/Direct.module.css';
import { Fragment, useState } from 'react';
import Chat from './Chat';
import Bar from './Bar';
import Friends from './Friends';
import Default from './Default';
import Pending from './Pending';

const Direct = (props) => {
  const { myuser, friends, friend, changeFriend, content, updateContent, messages, sendMessage, updateModal, users, sendFriendRequest, updateFriendContent, friendContent, requests, sendFriendRequestResponse } = props;

  const [directView, setDirectView] = useState('all');

  const updateDirectView = (view) => {
    console.log('hello', view);
    setDirectView(view);
  };

  const [friendsSetting, setFriendsSetting] = useState('all');

  const addFriend = () => {
    setFriendsSetting('add_friend');
  };

  return (
    <Fragment>
      <Friends myuser={myuser} friends={friends} friend={friend} changeFriend={changeFriend} updateModal={updateModal} />
      {friend.id === 'default' ?
      <div className={styles.main}>
        <Bar addFriend={addFriend} updateDirectView={updateDirectView} />
        <div className={styles.flex}>
          {directView === 'all' ?
          <Default friends={friends} changeFriend={changeFriend} friendsSetting={friendsSetting} friendContent={friendContent} updateFriendContent={updateFriendContent} sendFriendRequest={sendFriendRequest} /> :
          <Pending requests={requests} sendFriendRequestResponse={sendFriendRequestResponse} updateModal={updateModal} />}
        </div>
      </div> :
      <div className={styles.main}>
        <Bar addFriend={addFriend} updateDirectView={updateDirectView} />
        <div className={styles.flex}>
          <Chat content={content} updateContent={updateContent} messages={messages} sendMessage={sendMessage} />
        </div>
      </div>}
    </Fragment>
  );
};

const Test = (props) => {
  const { myuser, friends, friend, changeFriend, content, updateContent, messages, sendMessage, updateModal, users, sendFriendRequest, updateFriendContent, friendContent, addFriend, updateDirectView, friendsSetting, directView } = props;

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