import styles from '@/styles/Bar.module.css';
import { signOut } from 'next-auth/react';

const Bar = (props) => {
  const { title } = props;

  return (
    <div className={styles.container}>
      <h3># {title ? title.name : 'Empty'}</h3>
      <div onClick={signOut} className={styles.sign_out}>Sign Out</div>
    </div>
  );
};

export default Bar;