import { addRoom } from '@/lib/mysql';

const Handler = async (req, res) => {
  const { group_name, myuser } = req.body;
  const { insertId } = await addRoom(group_name, myuser.id);
  console.log(group_name, myuser);
  const room = {
    id: insertId,
    name: group_name,
    image: '/img/default.jpg',
    created_by: myuser.id
  }
  res.send(room);
};

export default Handler;