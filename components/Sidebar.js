import styles from '@/styles/Sidebar.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Sidebar = (props) => {
  const { changeDirect, rooms, changeRoom, updateModal } = props;

  return (
    <div className={styles.container}>
      <div onClick={changeDirect} className={styles.direct}>
        <Image className={styles.direct_img} src='/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg' alt='' width='50' height='50' />
      </div>
      <div className={styles.line}></div>
      <div className={styles.rooms}>
        {rooms.map((room) => {
          return <Room room={room} changeRoom={changeRoom} key={room.id} />
        })}
      </div>
      <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={() => { updateModal('room'); }} />
      <div onClick={() => { updateModal('notification'); }}>Open</div>
    </div>
  );
};

const Room = (props) => {
  const { room, changeRoom } = props;

  return (
    <div onClick={() => { changeRoom(room.id); }} className={styles.room}>
      <Image className={styles.room_img} src={room.image} alt='' width='50' height='50' />
      {room.notifications !== 0 && <div className={styles.room_notifications}>{room.notifications}</div>}
    </div>
  );
};

export default Sidebar;

// import styles from '@/styles/Rooms.module.css';
// import Image from 'next/image';

// const Rooms = (props) => {
//   const { rooms } = props;

//   return (
//     <div className={styles.container}>
//       <div className={styles.direct}>
//         <Image className={styles.direct_img} src='/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg' alt='' width='60' height='60' />
//       </div>
//       <div className={styles.line}></div>
//       <div className={styles.rooms}>
//         {rooms.map((room, index) => {
//           return <Room room={room} key={room.id} />
//         })}
//       </div>
//     </div>
//   );
// };

// const Room = (props) => {
//   const { room } = props;

//   return (
//     <div className={styles.room}>
//       <Image className={styles.room_img} src={room.image} alt='' width='60' height='60' />
//     </div>
//   );
// };

// export default Rooms;