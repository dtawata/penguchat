import { hashPassword } from '@/lib/bcrypt';
import { getEmail, getUsername, addUser, addJoinedRoom } from '@/lib/mysql';

const Handler = async (req, res) => {
  try {
    const { email, username, password, demo } = req.body;
    const emailExists = await getEmail(email);
    if (emailExists) throw new Error('emailError:Email is already used.');
    const usernameExists = await getUsername(username);
    if (usernameExists) throw new Error('usernameError:Username is taken.');
    const hashedPassword = await hashPassword(password);
    const random = Math.floor(Math.random() * 8 + 1);
    const { insertId } = await addUser({ ...req.body, password: hashedPassword, image: `user${random}.jpg` });
    if (demo) {
      await addJoinedRoom(insertId, 1);
    }
    res.status(200).send('New account created!');
  } catch(error) {
    const index = error.message.indexOf(':');
    const type = error.message.slice(0, index);
    const message = error.message.slice(index + 1);
    res.status(400).send({ type, message });
  }
};

export default Handler;