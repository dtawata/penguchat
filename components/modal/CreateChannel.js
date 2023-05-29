import styles from '@/styles/CreateChannel.module.css';

const CreateChannel = (props) => {
  const { content } = props;
  const { updateContent, submitContent } = props;

  return (
    <form onSubmit={submitContent} className={styles.form}>
      <input onChange={updateContent} className={styles.input} type='text' value={content} placeholder='Channel Name' />
      <button className={styles.button} type='submit'>Create</button>
    </form>
  );
};

export default CreateChannel;