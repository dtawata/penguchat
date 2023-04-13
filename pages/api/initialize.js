import { getRoomMessages, getUsersInRoom } from '@/lib/mysql';

const Handler = async (req, res) => {
  const { room_id, channel_id } = req.query;
  console.log(room_id);
  const [messages, users] = await Promise.all([getRoomMessages(room_id, channel_id), getUsersInRoom(room_id)]);
  res.send({ messages, users });
};

export default Handler;