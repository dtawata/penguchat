import { hashPassword } from "../../../lib/bcrypt";
import { addUser, addJoinedRoom, addFriends } from '../../../lib/mysql';

const Handler = async (req, res) => {
  try {
    console.log('yoooo');
    const { password } = req.body;
    const hashedPassword = await hashPassword(password);
    console.log('hash', hashedPassword);
    const user = await addUser({
      ...req.body,
      password: hashedPassword
    });
    console.log('user', user);
    // await Promise.all([addJoinedRoom(user.insertId, 1), addJoinedRoom(user.insertId, 2), addJoinedRoom(user.insertId, 3)]);
    // for (let i = 1; i < user.insertId; i++) {
    //   await Promise.all([addFriends(user.insertId, i, `${i}:${user.insertId}`), addFriends(i, user.insertId, `${i}:${user.insertId}`)]);
    // }
    res.status(200).send('success');
  } catch(error) {
    res.status(400).send(error);
  }
};

export default Handler;