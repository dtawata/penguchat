import styles from '@/styles/CreateRoom.module.css';
import Image from 'next/image';

const CreateRoom = (props) => {
  const { content } = props;
  const { updateContent, submitContent } = props;

  return (
    <form onSubmit={submitContent} className={styles.form}>
      <div className={styles.inner}>
        <h3 className={styles.title}>Customize your server</h3>
        <div className={styles.text}>Give your new server a personality with a name and an icon. You can always change it later.</div>
        <div className={styles.icons}>
          <Image className={styles.icon} src='https://penguchat-room.s3.amazonaws.com/default.jpg' alt='' width='50' height='50' />
          <Image className={styles.icon} src='https://penguchat-room.s3.amazonaws.com/default.jpg' alt='' width='50' height='50' />
          <Image className={styles.icon} src='https://penguchat-room.s3.amazonaws.com/default.jpg' alt='' width='50' height='50' />
        </div>
        <h3 className={styles.title2}>Server Name</h3>
        <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Server' />
      </div>
      <div className={styles.bottom}>
        <div>Back</div>
        <button className={styles.button} type='submit'>Create</button>
      </div>
    </form>
  );
};

export default CreateRoom;