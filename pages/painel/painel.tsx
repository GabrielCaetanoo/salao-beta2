// pages/painel.tsx
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

export default function PainelAdmin() {
  return (
    <div>
      <h1>Painel Admin</h1>
      {/* Conteúdo restrito */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { props: {} };
};