import styles from '@/styles/Chat.module.css';

const Chat = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.chat_top}></div>
      <div className={styles.chat_bot}>
        <form className={styles.form}>
          <input className={styles.input} type='text' placeholder='Message @Channel' />
        </form>
      </div>
    </div>
  );
};

export default Chat;