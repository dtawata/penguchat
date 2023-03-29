import styles from '@/styles/Home.module.css'
import Direct from '@/components/direct/Direct';
import Group from '@/components/group/Group';

const Home = () => {
  return (
    <div className={styles.container}>
      <Group />
    </div>
  );
};

export default Home;
