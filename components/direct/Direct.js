import styles from '@/styles/Direct.module.css';
import { Fragment, useState } from 'react';
import Chat from './Chat';
import Bar from './Bar';
import Friends from './Friends';
import Default from './Default';

const Direct = (props) => {
  const { myuser, friends, friend, changeFriend, content, updateContent, messages, sendMessage, updateModal, users, sendFriendRequest, updateFriendContent, friendContent } = props;


  const [friendsSetting, setFriendsSetting] = useState('all');

  const addFriend = () => {
    setFriendsSetting('add_friend');
  };

  return (
    <Fragment>
      <Friends myuser={myuser} friends={friends} friend={friend} changeFriend={changeFriend} updateModal={updateModal} />
      {friend.id === 'default' ?
      <div className={styles.main}>
        <Bar addFriend={addFriend} />
        <div className={styles.flex}>
          <Default friends={friends} changeFriend={changeFriend} friendsSetting={friendsSetting} friendContent={friendContent} updateFriendContent={updateFriendContent} sendFriendRequest={sendFriendRequest} />
        </div>
      </div> :
      <div className={styles.main}>
        <Bar addFriend={addFriend} />
        <div className={styles.flex}>
          <Chat content={content} updateContent={updateContent} messages={messages} sendMessage={sendMessage} />
        </div>
      </div>}
    </Fragment>
  );
};

export default Direct;