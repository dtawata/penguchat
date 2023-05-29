import styles from '@/styles/InviteFriend.module.css';

const InviteFriend = (props) => {
  const { content } = props;
  const { updateContent, submitContent } = props;

  return (
    <form onSubmit={submitContent} className={styles.form}>
      <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Username' />
      <button className={styles.button} type='submit'>Send Invite</button>
    </form>
  );
};

export default InviteFriend;