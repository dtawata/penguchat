import styles from '@/styles/column2/Channels.module.css';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faPlus } from '@fortawesome/free-solid-svg-icons';

const Channels = (props) => {
  const { myUser, room, channels, channel } = props;
  const { changeChannel, updateModal } = props;
  const selected = channel.id;

  return (
    <Fragment>
      <div className={styles.bar}>
        <h3 className={styles.title}>{room.name}</h3>
      </div>
      <div className={styles.channels}>
        {channels.map((channel) => {
          if (channel.id === selected) return <Selected channel={channel} key={channel.id} />
          return <Channel channel={channel} changeChannel={changeChannel} key={channel.id} />
        })}
        {myUser.id === room.created_by &&
        <Fragment>
          <div onClick={() => { updateModal('channel'); }} className={styles.update}>
            <FontAwesomeIcon icon={faPlus} className={styles.update_icon} />
            <div className={styles.update_text}>Add Channel</div>
          </div>
          <div onClick={() => { updateModal('room_invite'); }} className={styles.update}>
            <FontAwesomeIcon icon={faPlus} className={styles.update_icon} />
            <div className={styles.update_text}>Invite Friends</div>
          </div>
        </Fragment>}
      </div>
    </Fragment>
  );
};

const Channel = (props) => {
  const { channel, changeChannel } = props;

  return (
    <Fragment>
      <div onClick={() => { changeChannel(channel.id); }} className={styles.channel}>
        <div className={styles.flex}>
          <FontAwesomeIcon icon={faHashtag} className={styles.channel_icon} />
          <div className={styles.channel_text}>{channel.name}</div>
        </div>
        {channel.notifications !== 0 ?
        <div className={styles.channel_notifications}>{channel.notifications}</div> :
        <div className={styles.channel_notifications_filler}></div>}
      </div>
    </Fragment>
  );
};

const Selected = (props) => {
  const { channel } = props;

  return (
    <Fragment>
      <div className={`${styles.channel} ${styles.active}`}>
        <div className={styles.flex}>
          <FontAwesomeIcon icon={faHashtag} className={styles.channel_icon} />
          <div className={styles.channel_text}>{channel.name}</div>
        </div>
        {channel.notifications !== 0 ?
        <div className={styles.channel_notifications}>{channel.notifications}</div> :
        <div className={styles.filler}></div>}
      </div>
    </Fragment>
  );
};

export default Channels;