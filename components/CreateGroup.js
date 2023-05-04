import styles from '@/styles/CreateGroup.module.css';

const CreateGroup = (props) => {
  const { createGroup, groupContent, updateGroupContent, updateModal } = props;

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div onClick={() => { updateModal(false) }}>Close</div>
        <form onSubmit={createGroup} className={styles.form}>
          <input onChange={updateGroupContent} className={styles.input} type='text' value={groupContent} placeholder='Group Name' />
          <button className={styles.button} type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;