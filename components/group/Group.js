import styles from '@/styles/Group.module.css';
import { Fragment } from 'react';
import Rooms from './rooms/Rooms';
import Channels from './channels/Channels';
import Bar from './bar/Bar';
import Chat from './chat/Chat';

const Group = (props) => {
  const { state, content, updateContent } = props;

  return (
    <Fragment>
      <Rooms rooms={state.rooms} />
      <Channels channels={state.channels} />
      <div className={styles.main}>
        <Bar />
        <div className={styles.flex}>
          <Chat content={content} updateContent={updateContent} />
          <div className={styles.user}></div>
        </div>
      </div>
    </Fragment>
  );
};


export default Group;