import React, { useState } from 'react';
import { criarCliente, atualizarCliente } from '../api';

const etapas = ['lead', 'contato', 'visita', 'proposta', 'fechamento'];
const origens = ['', 'Zap Imóveis', 'OLX', 'Indicação', 'Portal', 'Redes Sociais', 'Outro'];

export default function ModalCliente({ cliente, onFechar, onSalvar }) {
  const [dados, setDados] = useState({
    nome: cliente?.nome || '',
    telefone: cliente?.telefone || '',
    email: cliente?.email || '',
    origem: cliente?.origem || '',
    etapa: cliente?.etapa || 'lead',
    proximo_contato: cliente?.proximo_contato || '',
    observacoes: cliente?.observacoes || ''
  });
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dados.nome.trim()) { setErro('Nome é obrigatório'); return; }
    try {
      if (cliente?.id) {
        await atualizarCliente(cliente.id, dados);
      } else {
        await criarCliente(dados);
      }
      onSalvar();
    } catch (err) {
      setErro('Erro ao salvar');
    }
  };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{cliente?.id ? '✏️ Editar Cliente' : '➕ Novo Cliente'}</h2>
          <button className="btn-fechar" onClick={onFechar}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {erro && <div className="erro">{erro}</div>}
          <div className="form-grid">
            <div className="form-group full">
              <label>Nome *</label>
              <input value={dados.nome} onChange={e => setDados({ ...dados, nome: e.target.value })} placeholder="Nome do cliente" autoFocus />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input value={dados.telefone} onChange={e => setDados({ ...dados, telefone: e.target.value })} placeholder="(11) 99999-9999" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={dados.email} onChange={e => setDados({ ...dados, email: e.target.value })} placeholder="cliente@email.com" />
            </div>
            <div className="form-group">
              <label>Origem</label>
              <select value={dados.origem} onChange={e => setDados({ ...dados, origem: e.target.value })}>
                {origens.map(o => <option key={o} value={o}>{o || 'Selecione...'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Etapa</label>
              <select value={dados.etapa} onChange={e => setDados({ ...dados, etapa: e.target.value })}>
                {etapas.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Próximo Contato</label>
              <input type="datetime-local" value={dados.proximo_contato} onChange={e => setDados({ ...dados, proximo_contato: e.target.value })} />
            </div>
            <div className="form-group full">
              <label>Observações</label>
              <textarea value={dados.observacoes} onChange={e => setDados({ ...dados, observacoes: e.target.value })} rows={3} placeholder="Informações adicionais..." />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onFechar}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
