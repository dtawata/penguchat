import styles from '@/styles/Sidebar.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Sidebar = (props) => {
  const { direct, rooms, room } = props;
  const { changeDirect, changeRoom, updateModal } = props;

  return (
    <div className={styles.container}>
      <div onClick={changeDirect} className={styles.direct}>
        <Image className={styles.direct_img} src='https://penguchat-room.s3.amazonaws.com/default.jpg' alt='' width='55' height='55' />
        {direct.notifications !== 0 && <div className={styles.direct_notifications}>{direct.notifications}</div>}
      </div>
      <div className={styles.line}></div>
      <div className={styles.rooms}>
        {rooms.map((room) => {
          return <Room room={room} changeRoom={changeRoom} key={room.id} />
        })}
      </div>
      <div onClick={() => { updateModal('room'); }} className={styles.icon_container}>
        <FontAwesomeIcon icon={faPlus} className={styles.icon} />
      </div>
    </div>
  );
};

const Room = (props) => {
  const { room, changeRoom } = props;

  return (
    <div onClick={() => { changeRoom(room.id); }} className={styles.room}>
      <Image className={styles.room_img} src={`https://penguchat-room.s3.amazonaws.com/${room.image}`} alt='' width='55' height='55' />
      {room.notifications !== 0 && <div className={styles.room_notifications}>{room.notifications}</div>}
    </div>
  );
};

export default Sidebar;
