import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import FunilVendas from './components/FunilVendas';
import FichaCliente from './components/FichaCliente';
import Agenda from './components/Agenda';
import ModalCliente from './components/ModalCliente';
import AudioInput from './components/AudioInput';
import { getClientes, getAtividades } from './api';

const etapas = ['lead', 'contato', 'visita', 'proposta', 'fechamento'];
const etapasLabels = { lead: 'Lead', contato: 'Contato', visita: 'Visita', proposta: 'Proposta', fechamento: 'Fechamento' };

export default function App() {
  const [tela, setTela] = useState('dashboard');
  const [clientes, setClientes] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [clienteDetalhe, setClienteDetalhe] = useState(null);

  const carregar = useCallback(async () => {
    const c = await getClientes();
    setClientes(c);
    const a = await getAtividades();
    setAtividades(a);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const check = setInterval(async () => {
      const c = await getClientes();
      const agora = new Date();
      c.forEach(cl => {
        if (cl.proximo_contato) {
          const dataAgenda = new Date(cl.proximo_contato.replace(' ', 'T'));
          const diff = Math.abs(dataAgenda - agora);
          if (diff < 60000 && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('📅 Lembrete Metah Imob', {
              body: `Contato agendado: ${cl.nome}`,
              icon: 'https://img.icons8.com/color/48/real-estate.png'
            });
          }
        }
      });
    }, 30000);
    return () => clearInterval(check);
  }, []);

  const handleAudioTranscrito = (texto) => {
    const nomeMatch = texto.match(/Cliente\s+([^,]+)/);
    const etapaMatch = texto.match(/etapa\s+(\w+)/);
    const origemMatch = texto.match(/origem\s+(.+)/);
    setClienteEditando({
      nome: nomeMatch ? nomeMatch[1].trim() : '',
      etapa: etapaMatch ? etapaMatch[1] : 'lead',
      origem: origemMatch ? origemMatch[1].trim() : ''
    });
    setModalAberto(true);
  };

  const totalEtapa = (etapa) => clientes.filter(c => c.etapa === etapa).length;
  const leadsHoje = clientes.filter(c => c.data_cadastro === new Date().toISOString().split('T')[0] && c.etapa === 'lead').length;

  const dataAtual = new Date().toISOString().split('T')[0];
  const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const visitasAgendadas = clientes.filter(c =>
    c.etapa === 'visita' && c.proximo_contato &&
    (c.proximo_contato.startsWith(dataAtual) || c.proximo_contato.startsWith(amanha))
  ).length;

  const totalFechados = clientes.filter(c => c.etapa === 'fechamento').length;
  const taxaConversao = clientes.length > 0 ? ((totalFechados / clientes.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="app">
      <Sidebar tela={tela} setTela={setTela} />
      <main className="main-content">
        <header className="top-bar">
          <h1>
            {tela === 'dashboard' && '📊 Dashboard'}
            {tela === 'funil' && '📋 Funil de Vendas'}
            {tela === 'clientes' && '👥 Clientes'}
            {tela === 'agenda' && '📅 Agenda'}
          </h1>
          <div className="top-actions">
            <AudioInput onTranscrito={handleAudioTranscrito} />
            <button className="btn-primary" onClick={() => { setClienteEditando(null); setModalAberto(true); }}>
              + Novo Cliente
            </button>
          </div>
        </header>

        {tela === 'dashboard' && (
          <div className="dashboard">
            <div className="card-dash" style={{ background: 'linear-gradient(135deg, #1a3a2a, #2d5a3e)' }}>
              <span className="card-num">{clientes.length}</span>
              <span className="card-label">Total de Clientes</span>
            </div>
            <div className="card-dash" style={{ background: 'linear-gradient(135deg, #2d5a3e, #4a8c6f)' }}>
              <span className="card-num">{leadsHoje}</span>
              <span className="card-label">Leads Hoje</span>
            </div>
            <div className="card-dash" style={{ background: 'linear-gradient(135deg, #b8860b, #daa520)' }}>
              <span className="card-num">{visitasAgendadas}</span>
              <span className="card-label">Visitas Agendadas</span>
            </div>
            <div className="card-dash" style={{ background: 'linear-gradient(135deg, #2d5a3e, #4caf50)' }}>
              <span className="card-num">{taxaConversao}%</span>
              <span className="card-label">Taxa de Conversão</span>
            </div>
            <div className="card-dash" style={{ background: 'linear-gradient(135deg, #1a3a2a, #2d5a3e)' }}>
              <span className="card-num">{totalFechados}</span>
              <span className="card-label">Fechamentos</span>
            </div>
            <div className="card-dash full-width">
              <h3>📈 Funil Resumido</h3>
              <div className="mini-funil">
                {etapas.map(et => (
                  <div key={et} className="mini-etapa">
                    <span className="mini-label">{etapasLabels[et]}</span>
                    <div className="mini-bar" style={{ width: `${(totalEtapa(et) / Math.max(clientes.length, 1)) * 100}%`, background: et === 'lead' ? '#9e9e9e' : et === 'contato' ? '#42a5f5' : et === 'visita' ? '#ffa726' : et === 'proposta' ? '#ff7043' : '#66bb6a' }}></div>
                    <span className="mini-num">{totalEtapa(et)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tela === 'funil' && (
          <FunilVendas clientes={clientes} onCarregar={carregar} onVerDetalhe={setClienteDetalhe} onEditar={(c) => { setClienteEditando(c); setModalAberto(true); }} />
        )}

        {tela === 'clientes' && (
          <div className="lista-clientes">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Etapa</th>
                  <th>Origem</th>
                  <th>Cadastro</th>
                  <th>Próx. Contato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.nome}</strong></td>
                    <td>{c.telefone && <a href={`https://wa.me/55${c.telefone.replace(/\D/g, '')}`} target="_blank" className="link-whats">📱 {c.telefone}</a>}</td>
                    <td><span className={`etapa-badge etapa-${c.etapa}`}>{etapasLabels[c.etapa]}</span></td>
                    <td>{c.origem}</td>
                    <td>{new Date(c.data_cadastro).toLocaleDateString('pt-BR')}</td>
                    <td>{c.proximo_contato ? new Date(c.proximo_contato).toLocaleString('pt-BR') : '—'}</td>
                    <td className="acoes">
                      <button className="btn-sm" onClick={() => setClienteDetalhe(c)}>👁</button>
                      <button className="btn-sm" onClick={() => { setClienteEditando(c); setModalAberto(true); }}>✏️</button>
                      <button className="btn-sm" onClick={() => { setClienteEditando(c); setModalAberto(true); }}>📅</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tela === 'agenda' && <Agenda clientes={clientes} onCarregar={carregar} />}

        {clienteDetalhe && (
          <FichaCliente cliente={clienteDetalhe} onFechar={() => setClienteDetalhe(null)} onEditar={(c) => { setClienteEditando(c); setModalAberto(true); setClienteDetalhe(null); }} onCarregar={carregar} />
        )}

        {modalAberto && (
          <ModalCliente
            cliente={clienteEditando}
            onFechar={() => setModalAberto(false)}
            onSalvar={() => { setModalAberto(false); carregar(); }}
          />
        )}
      </main>
    </div>
  );
}