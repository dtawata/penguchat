import { getUser, addFriendRequest } from '@/lib/mysql';

const Handler = async (req, res) => {
  const { other_id, username } = req.body;

  console.log(other_id);
  const user = await getUser(username);
  console.log('friend', user);
  await addFriendRequest(user.id, other_id);
  // const [messages, users] = await Promise.all([getRoomMessages(room_id, channel_id), getUsersInRoom(room_id)]);
  res.send({ });
};

export default Handler;