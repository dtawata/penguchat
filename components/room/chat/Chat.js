import styles from '@/styles/Chat.module.css';

const Chat = (props) => {
  const { content, updateContent, sendMessage, messages } = props;

  return (
    <div className={styles.container}>
      <div className={styles.chat_top}>
        {messages.map((item, index) => {
          return <div key={index}>message</div>
        })}
      </div>
      <div className={styles.chat_bot}>
        <form onSubmit={sendMessage} className={styles.form}>
          <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Message @Channel' />
        </form>
      </div>
    </div>
  );
};

export default Chat;