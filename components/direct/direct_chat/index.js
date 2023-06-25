import styles from '@/styles/DirectChat.module.css';
import Bar from './Bar';
import Chat from '@/components/Chat';

const DirectChat = (props) => {
  const { friend, messages, content } = props;
  const { openSidebar, sendMessage, updateContent } = props;

  return (
    <div className={styles.container}>
      <Bar friend={friend} openSidebar={openSidebar} />
      <div className={styles.flex}>
        <Chat messages={messages} sendMessage={sendMessage} content={content} updateContent={updateContent} />
      </div>
    </div>
  );
};

export default DirectChat;