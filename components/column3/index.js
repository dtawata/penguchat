import styles from '@/styles/column3/Room.module.css';
import Bar from './Bar';
import Chat from './Chat';
import Users from './Users';

const Room = (props) => {
  const { view, channel, friend, messages, content, users } = props;
  const { sendMessage, updateContent, changeFriend, openSidebar } = props;

  return (
    <div className={styles.container}>
      <Bar view={view} channel={channel} friend={friend} openSidebar={openSidebar} />
      <div className={styles.flex}>
        <Chat messages={messages} sendMessage={sendMessage} content={content} updateContent={updateContent} />
        {view === 'room' && <Users users={users} changeFriend={changeFriend} />}
      </div>
    </div>
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