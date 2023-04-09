import { getUsers } from '@/lib/mysql';

const handler = async (req, res) => {
  const users = await getUsers();
  res.send(users);
};

export default handler;