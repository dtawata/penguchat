import styles from '@/styles/Modal.module.css';
// import styles from '@/styles/CreateChannel.module.css';
// import styles from '@/styles/CreateRoom.module.css';
// import styles from '@/styles/InviteFriend.module.css';
import { useState, useEffect } from 'react';

const Modal = (props) => {
  const { modal } = props;
  const { updateModal, createRoom, createChannel, sendFriendInvite } = props;
  const [content, setContent] = useState('');

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const submitContent = (e) => {
    e.preventDefault();
    if (modal === 'room') {
      const room_name = content;
      setContent('');
      createRoom(room_name);
    } else if (modal === 'channel') {
      const channel_name = content;
      setContent('');
      createChannel(channel_name);
    } else if (modal === 'invite') {
      const username = content;
      setContent('');
      sendFriendInvite(username);
    }
  };

  useEffect(() => {
    console.log('modal', modal);
  }, [modal])

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div onClick={() => { updateModal(false) }}>Close</div>
        {modal === 'room' && <CreateRoom content={content} updateContent={updateContent} submitContent={submitContent} />}
        {modal === 'channel' && <CreateChannel content={content} updateContent={updateContent} submitContent={submitContent} />}
        {modal === 'friend' && <InviteFriend content={content} updateContent={updateContent} submitContent={submitContent} />}
      </div>
    </div>
  );
};

const CreateRoom = (props) => {
  const { content } = props;
  const { updateContent, submitContent } = props;

  return (
    <form onSubmit={submitContent} className={styles.form}>
      <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Room Name' />
      <button className={styles.button} type='submit'>Submit</button>
    </form>
  );
};

const CreateChannel = (props) => {
  const { content } = props;
  const { updateContent, submitContent } = props;

  return (
    <form onSubmit={submitContent} className={styles.form}>
      <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Channel Name' />
      <button className={styles.button} type='submit'>Submit</button>
    </form>
  );
};

const InviteFriend = (props) => {
  const { content } = props;
  const { updateContent, submitContent } = props;

  return (
    <form onSubmit={submitContent} className={styles.form}>
      <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Friend' />
      <button className={styles.button} type='submit'>Send Invite</button>
    </form>
  );
};

export default Modal;