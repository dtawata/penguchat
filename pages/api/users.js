import { getUsers } from '@/lib/mysql';

const Handler = async (req, res) => {
  const users = await getUsers();
  res.send(users);
};

export default Handler;