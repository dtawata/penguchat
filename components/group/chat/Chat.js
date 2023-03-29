import styles from '@/styles/Chat.module.css';

const Chat = (props) => {
  const { content, updateContent } = props;

  return (
    <div className={styles.container}>
      <div className={styles.chat_top}></div>
      <div className={styles.chat_bot}>
        <form className={styles.form}>
          <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Message @Channel' />
        </form>
      </div>
    </div>
  );
};

export default Chat;