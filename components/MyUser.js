import styles from '@/styles/MyUser.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faGear, faUser } from '@fortawesome/free-solid-svg-icons';

const MyUser = (props) => {
  const { myuser } = props;

  return (
    <div className={styles.container}>
      <div className={styles.myuser}>
        <div className={styles.myuser_left}>
          <Image className={styles.myuser_img} src={myuser.image} alt='' width='33' height='33' />
          <div className={styles.myuser_mid}>
            <div className={styles.myuser_username}>{myuser.username}</div>
            <div className={styles.myuser_numbers}>#3344</div>
          </div>
        </div>
        <div className={styles.icons}>
          <FontAwesomeIcon icon={faMicrophone} className={styles.icon} />
          <FontAwesomeIcon icon={faUser} className={styles.icon} />
          <FontAwesomeIcon icon={faGear} className={styles.icon} />
        </div>
      </div>

    </div>
  )
};

export default MyUser;