import styles from '@/styles/Channels.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';

const Channels = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.bar}>Title</div>
      <div className={styles.channels}>
        <Channel />
        <Channel />
        <Channel />
      </div>
    </div>
  );
};

const Channel = (props) => {
  return (
    <div className={styles.channel}>
      <div className={styles.channel_icon}>
        <FontAwesomeIcon icon={faHashtag} className={styles.channel_icon} />
      </div>
      <div className={styles.channel_text}>Channel</div>
    </div>
  );
};

export default Channels;