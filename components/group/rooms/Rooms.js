import styles from '@/styles/Rooms.module.css';
import Image from 'next/image';

const Rooms = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.direct}>
        <Image className={styles.direct_img} src='/img/kier-in-sight-2iy6ohGsGAc-unsplash.jpg' alt='' width='60' height='60' />
      </div>
      <div className={styles.line}></div>
      <div className={styles.rooms}>
        <Room />
        <Room />
        <Room />
      </div>
    </div>
  );
};

const Room = (props) => {
  return (
    <div className={styles.room}>
      <Image className={styles.room_img} src='/img/default.jpg' alt='' width='60' height='60' />
    </div>
  );
};

export default Rooms;