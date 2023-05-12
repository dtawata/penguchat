import styles from '@/styles/Room.module.css';
import { Fragment } from 'react';
import Channels from './Channels';
import Bar from './Bar';
import Chat from './Chat';
import Users from './Users';

const Room = (props) => {
  const { myUser, room, channels, channel, changeChannel, content, updateContent, messages, sendMessage, users, changeFriend, updateModal } = props;

  return (
    <Fragment>
      <Channels myUser={myUser} room={room} channels={channels} channel={channel} changeChannel={changeChannel} updateModal={updateModal} />
      <div className={styles.main}>
        <Bar />
        <div className={styles.flex}>
          <Chat content={content} updateContent={updateContent} messages={messages} sendMessage={sendMessage} />
          <Users users={users} changeFriend={changeFriend} />
        </div>
      </div>
    </Fragment>
  );
};

export default Room;


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