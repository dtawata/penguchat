import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../lib/bcrypt';
import { getPassword } from '../../../lib/mysql';

export default NextAuth({
  site: process.env.NEXTAUTH_URL,
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
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('redirect url', url)
      console.log('redirect base', baseUrl);
      return baseUrl;
      // return 'http://ec2-3-95-38-165.compute-1.amazonaws.com';
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  secret: 'test',
  jwt: {
    secret: 'test',
    encryption: true
  }
});