import { getRooms } from '@/lib/mysql';

const handler = async (req, res) => {
  const { user_id } = req.query;
  const rooms = await getRooms(user_id);
  res.send(rooms);
};

export default handler;