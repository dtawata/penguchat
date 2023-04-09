import styles from '@/styles/Room.module.css';
import { Fragment } from 'react';
import Channels from './channels/Channels';
import Bar from './bar/Bar';
import Chat from './chat/Chat';

const Room = (props) => {
  const { channels, content, updateContent, sendMessage, messages } = props;

  return (
    <Fragment>
      <Channels channels={channels} />
      <div className={styles.main}>
        <Bar />
        <div className={styles.flex}>
          <Chat content={content} updateContent={updateContent} messages={messages} sendMessage={sendMessage} />
        </div>
      </div>
    </Fragment>
  );
};

export default Room;

// import styles from '@/styles/Group.module.css';
// import { Fragment } from 'react';
// import Rooms from './rooms/Rooms';
// import Channels from './channels/Channels';
// import Bar from './bar/Bar';
// import Chat from './chat/Chat';
// // import Users from '../users/Users';

// const Group = (props) => {
//   const { state, content, updateContent, changeChannel } = props;

//   return (
//     <Fragment>
//       <Rooms rooms={state.rooms} />
//       <Channels channels={state.channels} changeChannel={changeChannel} />
//       <div className={styles.main}>
//         <Bar />
//         <div className={styles.flex}>
//           <Chat content={content} updateContent={updateContent} />
//           <div className={styles.user}></div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default Group;

// const { room, channels, channel, messages, content, users, changeView, changeChannel, updateContent, sendMessage } = props;
{/* <Channels room={room} channels={channels} channel={channel} changeChannel={changeChannel} /> */}
{/* <Bar title={channel} /> */}
{/* <Chat messages={messages} content={content} updateContent={updateContent} sendMessage={sendMessage} /> */}
{/* <Users users={users} changeView={changeView} /> */}