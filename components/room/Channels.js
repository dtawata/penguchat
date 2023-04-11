import styles from '@/styles/Channels.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';

const Channels = (props) => {
  const { channels, changeChannel } = props;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>Title</div>
      <div className={styles.channels}>
        {channels.map((channel) => {
          return <Channel channel={channel} changeChannel={changeChannel} key={channel.id} />
        })}
      </div>
    </div>
  );
};

const Channel = (props) => {
  const { channel, changeChannel } = props;

  return (
    <div onClick={() => { changeChannel(channel); }} className={styles.channel}>
      <div className={styles.channel_icon}>
        <FontAwesomeIcon icon={faHashtag} className={styles.channel_icon} />
      </div>
      <div className={styles.channel_text}>{channel.name}</div>
    </div>
  );
};

export default Channels;