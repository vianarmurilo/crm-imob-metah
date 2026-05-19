import React from 'react';
import { atualizarCliente } from '../api';

const etapas = ['lead', 'contato', 'visita', 'proposta', 'fechamento'];
const labels = { lead: 'Lead', contato: 'Contato', visita: 'Visita', proposta: 'Proposta', fechamento: 'Fechamento' };
const cores = { lead: '#9e9e9e', contato: '#42a5f5', visita: '#ffa726', proposta: '#ff7043', fechamento: '#66bb6a' };

export default function FichaCliente({ cliente, onFechar, onEditar, onCarregar }) {
  const avancarEtapa = async () => {
    const idx = etapas.indexOf(cliente.etapa);
    if (idx < etapas.length - 1) {
      await atualizarCliente(cliente.id, { etapa: etapas[idx + 1] });
      onCarregar();
    }
  };

  const voltarEtapa = async () => {
    const idx = etapas.indexOf(cliente.etapa);
    if (idx > 0) {
      await atualizarCliente(cliente.id, { etapa: etapas[idx - 1] });
      onCarregar();
    }
  };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal ficha-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👤 {cliente.nome}</h2>
          <button className="btn-fechar" onClick={onFechar}>✕</button>
        </div>
        <div className="ficha-body">
          <div className="ficha-etapa">
            <span className="etapa-badge etapa-{cliente.etapa}" style={{ background: cores[cliente.etapa] }}>{labels[cliente.etapa]}</span>
            <div className="ficha-navega-etapa">
              {cliente.etapa !== 'lead' && <button className="btn-sm" onClick={voltarEtapa}>◀ Anterior</button>}
              {cliente.etapa !== 'fechamento' && <button className="btn-sm" onClick={avancarEtapa}>Próxima ▶</button>}
            </div>
          </div>

          <div className="ficha-grid">
            <div className="ficha-campo">
              <span className="campo-label">📱 Telefone</span>
              <span className="campo-valor">{cliente.telefone || '—'}</span>
              {cliente.telefone && <a href={`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`} target="_blank" className="btn-whatsapp">💬 WhatsApp</a>}
            </div>
            <div className="ficha-campo">
              <span className="campo-label">📧 Email</span>
              <span className="campo-valor">{cliente.email || '—'}</span>
            </div>
            <div className="ficha-campo">
              <span className="campo-label">📌 Origem</span>
              <span className="campo-valor">{cliente.origem || '—'}</span>
            </div>
            <div className="ficha-campo">
              <span className="campo-label">📅 Cadastro</span>
              <span className="campo-valor">{new Date(cliente.data_cadastro).toLocaleDateString('pt-BR')}</span>
            </div>
            {cliente.proximo_contato && (
              <div className="ficha-campo full">
                <span className="campo-label">📅 Próximo Contato</span>
                <span className="campo-valor">{new Date(cliente.proximo_contato).toLocaleString('pt-BR')}</span>
              </div>
            )}
            {cliente.observacoes && (
              <div className="ficha-campo full">
                <span className="campo-label">📝 Observações</span>
                <span className="campo-valor">{cliente.observacoes}</span>
              </div>
            )}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => onEditar(cliente)}>✏️ Editar</button>
          <button className="btn-cancel" onClick={onFechar}>Fechar</button>
        </div>
      </div>
    </div>
  );
}