import styles from '@/styles/CreateChannel.module.css';

const CreateChannel = (props) => {
  const { createChannel, channelContent, updateChannelContent, updateModal } = props;

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div onClick={() => { updateModal(false); }}>Close</div>
        <form onSubmit={createChannel} className={styles.form}>
          <input onChange={updateChannelContent} className={styles.input} type='text' placeholder='Channel Name' />
          <button className={styles.button} type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;