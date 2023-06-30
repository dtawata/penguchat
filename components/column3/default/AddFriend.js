import styles from '@/styles/column3/default/AddFriend.module.css';
import { useState } from 'react';

const AddFriend = (props) => {
  const { sendFriendRequest } = props;

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
      <div className={styles.add_friend}>
        <h3 className={styles.title}>Add Friend</h3>
        <form onSubmit={submitContent} className={styles.form}>
          <input onChange={updateContent} className={styles.input} type='text' value={content} />
        </form>
      </div>
    </div>
  );
};

export default AddFriend;