import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../utils/prisma';

// Adicione esta interface
interface User {
  id: string;
  phone: string;
  name: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: "Telefone", type: "text" },
        name: { label: "Nome", type: "text" }
      },
      async authorize(credentials) {
        const user = await prisma.user.upsert({
          where: { phone: credentials?.phone },
          create: { 
            phone: credentials?.phone || '',
            name: credentials?.name || '' 
          },
          update: {}
        });
        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as User; // Tipo explícito
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User; // Tipo explícito
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});