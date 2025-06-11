'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Log para confirmar que os dados do formulário estão sendo lidos
  console.log(`Tentando login com Nome: ${name}, Telefone: ${phone}`);

  // 2. Chame o signIn com as variáveis de estado 'name' e 'phone'
  const result = await signIn('credentials', {
    phone: phone, // CORRIGIDO
    name: name,   // CORRIGIDO
    redirect: false
  });

  // 3. Log para ver o resultado da autenticação
  console.log("Resultado retornado pelo signIn:", result);

  if (result?.error) {
    console.error('Ocorreu um erro ao fazer login:', result.error);
    // O ideal é mostrar um erro para o usuário aqui
    alert(`Erro no login: ${result.error}`); 
  } else if (result?.ok) {
    // 4. Se deu tudo certo (result.ok é true), redirecione
    console.log("Login bem-sucedido, redirecionando para /agendamento...");
    router.push('/agendamento');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar</h2>
        <input
          type="text"
          placeholder="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}