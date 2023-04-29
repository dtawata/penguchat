import styles from '@/styles/Channels.module.css';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import MyUser from '@/components/MyUser';

const Channels = (props) => {
  const { myuser, room, channels, channel, changeChannel } = props;
  const selected = channel.id;

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <h3 className={styles.title}>{room.name}</h3>
      </div>
      <div className={styles.channels}>
        {channels.map((channel) => {
          return <Channel channel={channel} selected={selected} changeChannel={changeChannel} key={channel.id} />
        })}
      </div>
      <MyUser myuser={myuser} />
    </div>
  );
};

const Channel = (props) => {
  const { channel, selected, changeChannel } = props;

  return (
    <Fragment>
      {channel.id === selected ?
      <div className={`${styles.channel} ${styles.active}`}>
        <FontAwesomeIcon icon={faHashtag} className={styles.channel_icon} />
        <div className={styles.channel_text}>{channel.name} {channel.notifications !== 0 && channel.notifications}</div>
      </div> :
      <div onClick={() => { changeChannel(channel.id); }} className={styles.channel}>
        <FontAwesomeIcon icon={faHashtag} className={styles.channel_icon} />
        <div className={styles.channel_text}>{channel.name} {channel.notifications !== 0 && channel.notifications}</div>
      </div>}
    </Fragment>
  );
};

export default Channels;