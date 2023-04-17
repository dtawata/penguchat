import { getDirectMessages } from '@/lib/mysql';

const Handler = async (req, res) => {
  const { friend_id } = req.query;
  const messages = await getDirectMessages(friend_id);
  res.send({ messages });
};

export default Handler;