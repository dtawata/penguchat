import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../lib/bcrypt';
import { getPassword } from '../../../lib/mysql';

export default NextAuth({
  providers: [
    CredentialsProvider({
    id: 'credentials',
    async authorize(credentials) {
      try {
        const { username, password } = credentials;
        const user = await getPassword(username);
        if (!user) throw new Error('User not found!');
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error('Password is not valid!');
        return {
          name: user.username,
          email: user.email,
          image: '/image'
        };
      } catch(error) {
        return null;
      }
    }})
  ],
  secret: 'test',
  jwt: {
    secret: 'test',
    encryption: true
  },
  pages: {
    signIn: '/login',
    signOut: '/login'
  }
});