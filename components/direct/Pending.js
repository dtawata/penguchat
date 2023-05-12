import styles from '@/styles/Pending.module.css';
import { useState } from 'react';
import Image from 'next/image';

const Pending = (props) => {
  const { requests, invites, addFriend } = props;
  const { sendFriendResponse, sendFriendRequest, respondRoomInvite, updateModal } = props;

  const [content, setContent] = useState('');

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const submitContent = (e) => {
    e.preventDefault();
    const username = content;
    setContent('');
    sendFriendRequest(username);
  };

  return (
    <div className={styles.container}>
      {addFriend &&
      <div className={styles.add_friend}>
        <h3 className={styles.title}>Add Friend</h3>
        <form onSubmit={submitContent} className={styles.form}>
          <input onChange={updateContent} className={styles.input} type='text' value={content} />
        </form>
      </div>}
      <div className={styles.requests}>
        <h3 className={styles.title}>Friend Requests</h3>
        {requests.map((request) => {
          return <Request request={request} sendFriendResponse={sendFriendResponse} key={request.id} />
        })}
      </div>
      <div className={styles.invites}>
        <h3 className={styles.title}>Room Invites</h3>
        {invites.map((invite) => {
          return <Invite invite={invite} respondRoomInvite={respondRoomInvite} sendFriendResponse={sendFriendResponse} key={invite.id} />
        })}
      </div>
    </div>
  );
};

const Request = (props) => {
  const { request, sendFriendResponse } = props;

  return (
    <div className={styles.request}>
      <div className={styles.request_left}>
        <Image className={styles.request_image} src={request.image} alt='' width='30' height='30' />
        <div className={styles.request_message}><span className={styles.request_username}>{request.username}</span> has sent a friend request.</div>
      </div>
      <div className={styles.request_buttons}>
        <div onClick={() => { sendFriendResponse({ request, status: true }); }} className={styles.request_accept}>Accept</div>
        <div onClick={() => { sendFriendResponse({ request, status: false }); }} className={styles.request_reject}>Reject</div>
      </div>
    </div>
  );
};

const Invite = (props) => {
  const { invite, respondRoomInvite } = props;

  return (
    <div className={styles.request}>
      <div className={styles.request_left}>
        <Image className={styles.request_image} src={invite.room_image} alt='' width='30' height='30' />
        <div className={styles.request_message}><span className={styles.request_username}>{invite.requester_username}</span> has invited you to join <span className={styles.request_username}>{invite.room_name}</span>.</div>
      </div>
      <div className={styles.request_buttons}>
        <div onClick={() => { respondRoomInvite({ invite, status: true }); }} className={styles.request_accept}>Accept</div>
        <div onClick={() => { respondRoomInvite({ invite, status: false }); }} className={styles.request_reject}>Reject</div>
      </div>
    </div>
  );
};

export default Pending;