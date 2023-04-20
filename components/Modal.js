import styles from '@/styles/Modal.module.css';

const Modal = (props) => {
  const { closeFriends } = props;

  return (
    <div onClick={closeFriends} className={styles.container}>
      <div className={styles.modal}>
        Modal
      </div>
    </div>
  );
};

export default Modal;