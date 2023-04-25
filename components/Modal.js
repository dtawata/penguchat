import styles from '@/styles/Modal.module.css';
import Image from 'next/image';

const Modal = (props) => {
  const { requests, updateModal, sendFriendRequestResponse } = props;

  return (
    // <div onClick={closeFriends} className={styles.container}>
    <div className={styles.container}>
      <div className={styles.modal}>
        <div onClick={() => { updateModal(false); }}>Close</div>
        {requests.map((request, index) => {
          return <Request request={request} sendFriendRequestResponse={sendFriendRequestResponse} key={index} />
        })}
      </div>
    </div>
  );
};

const Request = (props) => {
  const { request, sendFriendRequestResponse } = props;

  return (
    <div className={styles.request}>
      <div className={styles.request_left}>
        <Image className={styles.request_image} src={request.image} alt='' width='30' height='30' />
        <div className={styles.request_message}><span className={styles.request_username}>{request.username}</span> has sent a friend request.</div>
      </div>
      <div className={styles.request_buttons}>
        <div onClick={() => { sendFriendRequestResponse({ request, status: true }); }} className={styles.request_accept}>Accept</div>
        <div onClick={() => { sendFriendRequestResponse({ request, status: false }); }} className={styles.request_reject}>Reject</div>
      </div>
    </div>
  );
};

export default Modal;