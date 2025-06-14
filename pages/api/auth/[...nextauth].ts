import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../utils/prisma';

// Para adicionar propriedades personalizadas à sessão e ao token com segurança de tipos,
// estendemos (augment) os tipos padrão do NextAuth.
// Idealmente, isso ficaria em um arquivo separado, como `types/next-auth.d.ts`.

declare module "next-auth/jwt" {
  /** Estende o tipo JWT padrão com nossas propriedades de usuário. */
  interface JWT {
    user?: {
      id: string;
      phone: string;
      nome: string;
    }
  }
}

declare module "next-auth" {
  /** Estende o tipo User padrão. */
  interface User {
    id: string;
    phone: string;
    nome: string;
  }
  
  /** Estende o tipo Session padrão para incluir nosso objeto de usuário personalizado. */
  interface Session {
    user: User; // O objeto `user` da sessão agora terá nossas propriedades personalizadas.
  }
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
      
      async authorize(credentials): Promise<User | null> {
        // Agora, esta função retorna o tipo `User` que estendemos.
        try {
          if (!credentials?.phone || !credentials?.name) {
            throw new Error('Nome e telefone são obrigatórios');
          }

          const userFromDb = await prisma.user.upsert({
            where: { telefone: credentials.phone },
            create: { 
              telefone: credentials.phone,
              nome: credentials.name,
            },
            update: {}
          });

          // O objeto retornado aqui é passado para o parâmetro `user` do callback `jwt`.
          return {
            id: userFromDb.id.toString(),
            phone: userFromDb.telefone,
            nome: userFromDb.nome
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
    error: '/login'
  },
  callbacks: {
    // Este callback é chamado sempre que um JWT é criado (no login).
    // O parâmetro `user` só está disponível no primeiro login.
    async jwt({ token, user }) {
      if (user) {
        // `user` é o objeto que retornamos do `authorize`.
        // Persistimos os dados do usuário no token.
        token.user = user;
      }
      return token;
    },
    // Este callback é chamado sempre que uma sessão é acessada.
    async session({ session, token }) {
      // O token agora contém nossos dados personalizados.
      // Nós os passamos para o objeto da sessão para que fiquem disponíveis no lado do cliente.
      if (token.user) {
        session.user = token.user; // Sem 'as any' ou erros de tipo!
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
});
