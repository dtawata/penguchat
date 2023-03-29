import { hashPassword } from "../../../lib/bcrypt";
import { addUser, addJoinedRoom } from '../../../lib/mysql';

const Handler = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await addUser({
      ...req.body,
      password: hashedPassword
    });
    await addJoinedRoom(user.insertId, 1);
    await addJoinedRoom(user.insertId, 2);
    res.status(200).send('success');
  } catch(error) {
    res.status(400).send(error);
  }
};

export default Handler;