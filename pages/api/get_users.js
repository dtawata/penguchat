import { getUsersInRoom } from '@/lib/mysql';

const Handler = async (req, res) => {
  const { room_id } = req.query;
  const users = await getUsersInRoom(room_id);
  res.send({ users });
};

export default Handler;