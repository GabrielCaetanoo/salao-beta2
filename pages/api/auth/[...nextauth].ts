import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../utils/prisma';

// Define uma interface local para o usuário que corresponde ao seu schema do Prisma
interface CustomUser {
  id: string; // O authorize do NextAuth espera que o id seja uma string
  phone: string;
  nome: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      // O nome interno do provedor.
      id: 'credentials',
      // O nome que será mostrado na tela de login (se houver uma tela automática).
      name: 'Credentials', 
      
      // Define os campos que o formulário de login deve esperar.
      credentials: {
        phone: { label: "Telefone", type: "text" },
        // A propriedade aqui deve ser 'name' para corresponder ao que o signIn envia,
        // mas podemos renomeá-la para 'nome' no objeto `credentials` dentro de authorize.
        name: { label: "Nome", type: "text" }
      },
      
      async authorize(credentials): Promise<CustomUser | null> {
        // A função `authorize` é onde a sua lógica de verificação acontece.
        try {
          if (!credentials?.phone || !credentials?.name) {
            throw new Error('Nome e telefone são obrigatórios');
          }

          // Usa 'upsert': cria um novo usuário se não existir, ou apenas o encontra se já existir.
          const user = await prisma.user.upsert({
            where: { telefone: credentials.phone },
            // Dados para criar um novo usuário.
            create: { 
              telefone: credentials.phone,
              // Usa o 'name' vindo das credenciais.
              nome: credentials.name,
            },
            // Se o usuário já existe, não fazemos nenhuma atualização nos dados dele.
            update: {}
          });

          // Retorna o objeto do usuário no formato esperado.
          // O id é convertido para string, pois é o que o NextAuth espera.
          return {
            id: user.id.toString(),
            phone: user.telefone,
            nome: user.nome
          };

        } catch (error) {
          console.error('Erro na autenticação:', error);
          // Retorna null se a autenticação falhar.
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login' // Redireciona para /login em caso de erro, pode passar query params se quiser
  },
  callbacks: {
    // O callback 'jwt' é chamado sempre que um JSON Web Token é criado ou atualizado.
    async jwt({ token, user }) {
      // Se o objeto 'user' (vindo do authorize) existe, estamos no primeiro login.
      // Adicionamos os dados do usuário ao token.
      if (user) {
        token.user = user;
      }
      return token;
    },
    // O callback 'session' é chamado sempre que uma sessão é acessada.
    async session({ session, token }) {
      // Adiciona os dados do usuário do token para o objeto da sessão,
      // tornando-os disponíveis no lado do cliente.
      if (token && token.user) {
        // @ts-expect-error: Permite adicionar propriedades customizadas ao objeto da sessão.
        session.user = token.user;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
});
