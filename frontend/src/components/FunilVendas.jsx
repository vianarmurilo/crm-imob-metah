import React from 'react';
import { atualizarCliente } from '../api';

const etapas = ['lead', 'contato', 'visita', 'proposta', 'fechamento'];
const labels = { lead: '🫥 Lead', contato: '📞 Contato', visita: '🏠 Visita', proposta: '📄 Proposta', fechamento: '✅ Fechamento' };
const cores = { lead: '#9e9e9e', contato: '#42a5f5', visita: '#ffa726', proposta: '#ff7043', fechamento: '#66bb6a' };

export default function FunilVendas({ clientes, onCarregar, onVerDetalhe, onEditar }) {
  const avancarEtapa = async (cliente) => {
    const idx = etapas.indexOf(cliente.etapa);
    if (idx < etapas.length - 1) {
      await atualizarCliente(cliente.id, { etapa: etapas[idx + 1] });
      onCarregar();
    }
  };

  const voltarEtapa = async (cliente) => {
    const idx = etapas.indexOf(cliente.etapa);
    if (idx > 0) {
      await atualizarCliente(cliente.id, { etapa: etapas[idx - 1] });
      onCarregar();
    }
  };

  return (
    <div className="kanban">
      {etapas.map(etapa => {
        const clientesEtapa = clientes.filter(c => c.etapa === etapa);
        return (
          <div key={etapa} className="kanban-coluna">
            <div className="kanban-header" style={{ borderColor: cores[etapa] }}>
              <span>{labels[etapa]}</span>
              <span className="kanban-count">{clientesEtapa.length}</span>
            </div>
            <div className="kanban-cards">
              {clientesEtapa.map(cliente => (
                <div key={cliente.id} className="kanban-card" onClick={() => onVerDetalhe(cliente)}>
                  <div className="card-nome">{cliente.nome}</div>
                  {cliente.telefone && <div className="card-info">📱 {cliente.telefone}</div>}
                  {cliente.origem && <div className="card-info">📌 {cliente.origem}</div>}
                  {cliente.proximo_contato && <div className="card-info">📅 {new Date(cliente.proximo_contato).toLocaleDateString('pt-BR')}</div>}
                  <div className="card-acoes">
                    {etapa !== 'lead' && <button className="btn-card" onClick={(e) => { e.stopPropagation(); voltarEtapa(cliente); }}>◀</button>}
                    {etapa !== 'fechamento' && <button className="btn-card" onClick={(e) => { e.stopPropagation(); avancarEtapa(cliente); }}>▶</button>}
                    <button className="btn-card" onClick={(e) => { e.stopPropagation(); onEditar(cliente); }}>✏️</button>
                    {cliente.telefone && <a href={`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`} target="_blank" className="btn-card" onClick={(e) => e.stopPropagation()}>💬</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}