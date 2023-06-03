import { addRoom } from '@/lib/mysql';

const Handler = async (req, res) => {
  const { group_name, myUser } = req.body;
  const { insertId } = await addRoom(group_name, myUser.id);
  const room = {
    id: insertId,
    name: group_name,
    image: 'default.jpg',
    created_by: myUser.id
  }
  res.send(room);
};

export default Handler;