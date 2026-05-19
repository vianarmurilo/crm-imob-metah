import React from 'react';
import { atualizarCliente } from '../api';

export default function Agenda({ clientes, onCarregar }) {
  const agendados = clientes
    .filter(c => c.proximo_contato)
    .sort((a, b) => new Date(a.proximo_contato) - new Date(b.proximo_contato));

  const hoje = new Date().toISOString().split('T')[0];
  const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const hojeItems = agendados.filter(c => c.proximo_contato.startsWith(hoje));
  const amanhaItems = agendados.filter(c => c.proximo_contato.startsWith(amanha));
  const proximos = agendados.filter(c => !c.proximo_contato.startsWith(hoje) && !c.proximo_contato.startsWith(amanha));

  const marcarConcluido = async (cliente) => {
    await atualizarCliente(cliente.id, { proximo_contato: null });
    onCarregar();
  };

  const renderCard = (cliente) => (
    <div key={cliente.id} className="agenda-card">
      <div className="agenda-info">
        <strong>{cliente.nome}</strong>
        <span className="etapa-badge etapa-{cliente.etapa}">{cliente.etapa}</span>
        <span className="agenda-data">{new Date(cliente.proximo_contato).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="agenda-acoes">
        {cliente.telefone && <a href={`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`} target="_blank" className="btn-sm">💬</a>}
        <button className="btn-sm" onClick={() => marcarConcluido(cliente)}>✅</button>
      </div>
    </div>
  );

  return (
    <div className="agenda-page">
      <section className="agenda-secao">
        <h2 className="agenda-titulo">🔴 Hoje</h2>
        {hojeItems.length === 0 ? <p className="agenda-vazio">Nenhum contato agendado para hoje</p> : hojeItems.map(renderCard)}
      </section>
      <section className="agenda-secao">
        <h2 className="agenda-titulo">🟡 Amanhã</h2>
        {amanhaItems.length === 0 ? <p className="agenda-vazio">Nenhum contato agendado para amanhã</p> : amanhaItems.map(renderCard)}
      </section>
      <section className="agenda-secao">
        <h2 className="agenda-titulo">🟢 Próximos</h2>
        {proximos.length === 0 ? <p className="agenda-vazio">Nenhum contato futuro agendado</p> : proximos.map(renderCard)}
      </section>
    </div>
  );
}