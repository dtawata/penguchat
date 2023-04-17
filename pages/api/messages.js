import { getRoomMessages } from '@/lib/mysql';

const Handler = async (req, res) => {
  const { room_id, channel_id } = req.query;
  const messages = await getRoomMessages(room_id, channel_id);
  res.send({ messages });
};

export default Handler;