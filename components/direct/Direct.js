import styles from '@/styles/Direct.module.css';
import { Fragment } from 'react';
import Chat from './Chat';
import Bar from './Bar';
import Friends from './Friends';
import Default from './Default';

const Direct = (props) => {
  const { friends, friend, changeFriend, content, updateContent, messages, sendMessage, openFriends, users } = props;

  return (
    <Fragment>
      <Friends friends={friends} friend={friend} changeFriend={changeFriend} openFriends={openFriends} />
      {friend.id === 'default' ?
      <div className={styles.main}>
        <Bar />
        <div className={styles.flex}>
          <Default friends={friends} changeFriend={changeFriend} />
        </div>
      </div> :
      <div className={styles.main}>
        <Bar />
        <div className={styles.flex}>
          <Chat content={content} updateContent={updateContent} messages={messages} sendMessage={sendMessage} />
        </div>
      </div>}
    </Fragment>
  );
};

export default Direct;