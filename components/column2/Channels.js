import styles from '@/styles/Channels.module.css';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faPlus } from '@fortawesome/free-solid-svg-icons';

const Channels = (props) => {
  const { myUser, room, channels, channel, changeChannel, updateModal } = props;
  const selected = channel.id;

  return (
    <Fragment>
      <div className={styles.bar}>
        <h3 className={styles.title}>{room.name}</h3>
      </div>
      <div className={styles.channels}>
        {channels.map((channel) => {
          return <Channel channel={channel} selected={selected} changeChannel={changeChannel} key={channel.id} />
        })}
        {myUser.id === room.created_by &&
        <div onClick={() => { updateModal('channel'); }} className={styles.update}>
          <FontAwesomeIcon icon={faPlus} className={styles.update_icon} />
          <div className={styles.update_text}>Add Channel</div>
        </div>}
        {myUser.id === room.created_by &&
        <div onClick={() => { updateModal('room_invite'); }} className={styles.update}>
          <FontAwesomeIcon icon={faPlus} className={styles.update_icon} />
          <div className={styles.update_text}>Invite Friends</div>
        </div>}
      </div>
    </Fragment>
  );
};


const Channel = (props) => {
  const { channel, selected, changeChannel } = props;

  return (
    <Fragment>
      {channel.id === selected ?
      <div className={`${styles.channel} ${styles.active}`}>
        <div className={styles.flex}>
          <FontAwesomeIcon icon={faHashtag} className={styles.channel_icon} />
          <div className={styles.channel_text}>{channel.name}</div>
        </div>
        {channel.notifications !== 0 ?
        <div className={styles.channel_notifications}>{channel.notifications}</div> :
        <div className={styles.filler}></div>}
      </div> :
      <div onClick={() => { changeChannel(channel.id); }} className={styles.channel}>
        <div className={styles.flex}>
          <FontAwesomeIcon icon={faHashtag} className={styles.channel_icon} />
          <div className={styles.channel_text}>{channel.name}</div>
        </div>
        {channel.notifications !== 0 ?
        <div className={styles.channel_notifications}>{channel.notifications}</div> :
        <div className={styles.filler}></div>}
      </div>}
    </Fragment>
  );
};

export default Channels;