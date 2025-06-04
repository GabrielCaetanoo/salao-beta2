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
    
    // Simula login (substitua por sua lógica real)
    const result = await signIn('credentials', {
      redirect: false,
      phone,
      name,
    });

    if (result?.ok) {
      router.push('/agendamento'); // Redireciona após login
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