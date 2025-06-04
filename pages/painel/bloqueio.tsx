// pages/painel/bloqueios.tsx
import { useState } from 'react';

export default function Bloqueios() {
  const [horarioBloqueado, setHorarioBloqueado] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('/api/bloqueios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horario: horarioBloqueado, motivo }),
    });
    if (response.ok) {
      alert('Horário bloqueado!');
    }
  };

  return (
    <div>
      <h2>Bloquear Horários</h2>
      <input
        type="datetime-local"
        value={horarioBloqueado}
        onChange={(e) => setHorarioBloqueado(e.target.value)}
      />
      <input
        type="text"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder="Motivo (opcional)"
      />
      <button onClick={handleSubmit}>Bloquear</button>
    </div>
  );
}