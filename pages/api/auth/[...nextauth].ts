import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../utils/prisma';

interface User {
  id: string;
  phone: string;
  name: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        phone: { label: "Telefone", type: "text" },
        name: { label: "Nome", type: "text" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.phone) throw new Error('Telefone é obrigatório');

          const user = await prisma.user.upsert({
            where: { phone: credentials.phone },
            create: { 
              phone: credentials.phone,
              name: credentials.name || `Usuário ${credentials.phone.slice(-4)}`
            },
            update: {}
          });

          return {
            id: user.id,
            phone: user.phone,
            name: user.name
          };
        } catch (error) {
          console.error('Erro na autenticação:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login?error=1' // Página personalizada para erros
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
});