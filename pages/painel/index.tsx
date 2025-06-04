import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { signOut } from 'next-auth/react';

type Agendamento = {
  id: number;
  service: string;
  date: string;
  user: { name: string };
};

export default function Painel({ agendamentos }: { agendamentos: Agendamento[] }) {
  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Painel Admin</h1>
        <button 
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Cliente</th>
            <th className="p-3 text-left">Serviço</th>
            <th className="p-3 text-left">Horário</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map((ag) => (
            <tr key={ag.id} className="border-b">
              <td className="p-3">{ag.user.name}</td>
              <td className="p-3">{ag.service}</td>
              <td className="p-3">{new Date(ag.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  // Substitua por sua chamada real à API ou Prisma
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/agendamento`);
  const agendamentos = await res.json();

  return { props: { agendamentos } };
};