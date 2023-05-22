import { getDirectMessages } from '@/lib/mysql';

const Handler = async (req, res) => {
  const { room_id } = req.query;
  const messages = await getDirectMessages(room_id);
  res.send({ messages });
};

export default Handler;