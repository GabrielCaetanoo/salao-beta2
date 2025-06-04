import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página de login após 1 segundo (opcional)
    const timer = setTimeout(() => {
      router.push('/login');
    }, 1000);

    return () => clearTimeout(timer); // Limpa o timeout se o componente desmontar
  }, [router]);

  return (
    <>
      <Head>
        <title>Salão Beauty - Redirecionando</title>
        <meta name="description" content="Sistema de agendamento para salão de beleza" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4">Salão Beauty</h1>
          <p className="text-gray-600">Redirecionando para o login...</p>
          {/* Opcional: Adicione um spinner */}
          <div className="mt-6">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </>
  );
}