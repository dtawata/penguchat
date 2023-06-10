import { hashPassword } from '@/lib/bcrypt';
import { getEmail, getUsername, addUser } from '@/lib/mysql';

const Handler = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const emailExists = await getEmail(email);
    if (emailExists) throw new Error('emailError:Email is already used.');
    const usernameExists = await getUsername(username);
    if (usernameExists) throw new Error('usernameError:Username is taken.');
    const hashedPassword = await hashPassword(password);
    await addUser({ ...req.body, password: hashedPassword });
    res.status(200).send('New account created!');
  } catch(error) {
    const index = error.message.indexOf(':');
    const type = error.message.slice(0, index);
    const message = error.message.slice(index + 1);
    res.status(400).send({ type, message });
  }
};

export default Handler;