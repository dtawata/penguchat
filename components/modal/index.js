import styles from '@/styles/Modal.module.css';
import { useState, useEffect } from 'react';
import CreateRoom from './CreateRoom';
import CreateChannel from './CreateChannel';
import InviteFriend from './InviteFriend';

const Modal = (props) => {
  const { modal } = props;
  const { updateModal, createRoom, createChannel, sendRoomInvite } = props;
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
    } else if (modal === 'room_invite') {
      const username = content;
      setContent('');
      sendRoomInvite(username);
    } else {
      console.log('submitContent: error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div onClick={() => { updateModal(false) }} className={styles.close}>X</div>
        {modal === 'room' && <CreateRoom content={content} updateContent={updateContent} submitContent={submitContent} />}
        {modal === 'channel' && <CreateChannel content={content} updateContent={updateContent} submitContent={submitContent} />}
        {modal === 'room_invite' && <InviteFriend content={content} updateContent={updateContent} submitContent={submitContent} />}
      </div>
    </div>
  );
};

export default Modal;