// import styles from '@/styles/Chat.module.css';
// import Image from 'next/image';
// import { DateTime } from 'luxon';

// const Chat = (props) => {
//   const { content, updateContent, sendMessage, messages } = props;
//   let username = null;
//   let date_time = null;

//   return (
//     <div className={styles.container}>
//       <div className={styles.messages}>
//         {messages.map((message) => {
//           if (username !== message.username) {
//             username = message.username;
//             date_time = DateTime.fromISO(message.created_at);
//             return <Message message={message} key={message.id} />
//           }
//           const seconds = DateTime.fromISO(message.created_at).diff(date_time, ['seconds']).toObject().seconds;
//           date_time = DateTime.fromISO(message.created_at);
//           if (seconds < 240) return <MessageAlt message={message} key={message.id} />
//           return <Message message={message} key={message.id} />
//         })}
//       </div>
//       <div className={styles.chat_bot}>
//         <form onSubmit={sendMessage} className={styles.form}>
//           <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Message @Channel' />
//         </form>
//       </div>
//     </div>
//   );
// };

// const Message = (props) => {
//   const { message } = props;

//   return (
//     <div className={styles.message}>
//       <div className={styles.message_left}>
//         <Image className={styles.message_image} src={`https://penguchat-users.s3.amazonaws.com/${message.image}`} alt='' width='40' height='40' />
//       </div>
//       <div className={styles.message_right}>
//         <div className={styles.flex}>
//           <div className={styles.message_username}>{message.username}</div>
//           <div className={styles.message_datetime}>{DateTime.fromISO(message.created_at).toLocaleString(DateTime.DATETIME_SHORT)}</div>
//         </div>
//         <div className={styles.message_content}>{message.content}</div>
//       </div>
//     </div>
//   );
// };

// const MessageAlt = (props) => {
//   const { message } = props;

//   return (
//     <div className={styles.message_alt}>
//       <div className={styles.message_alt_left}>
//         <div className={styles.message_alt_datetime}>{DateTime.fromISO(message.created_at).toLocaleString(DateTime.TIME_SIMPLE)}</div>
//       </div>
//       <div className={styles.message_alt_content}>{message.content}</div>
//     </div>
//   );
// };

// export default Chat;