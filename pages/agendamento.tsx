'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Atualizado para next/navigation
import toast from 'react-hot-toast';

export default function Agendamento() {
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('/api/agendamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service, date }),
    });

    if (!response.ok) throw new Error(await response.text());

    toast.success('Agendamento realizado com sucesso!', {
      duration: 4000,
      position: 'top-center',
    });
    router.push('/');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    toast.error(`Falha: ${errorMessage}`, {
      duration: 6000, // Mensagem de erro mais longa
      position: 'top-center',
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Agendar Serviço</h2>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
          disabled={isSubmitting}
        >
          <option value="">Selecione um serviço</option>
          <option value="Corte de Cabelo">Corte de Cabelo</option>
          <option value="Barba">Barba</option>
        </select>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
        </button>
      </form>
    </div>
  );
}