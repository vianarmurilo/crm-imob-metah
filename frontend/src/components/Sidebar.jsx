import React from 'react';

export default function Sidebar({ tela, setTela }) {
  const itens = [
    { id: 'dashboard', icone: '📊', label: 'Dashboard' },
    { id: 'funil', icone: '📋', label: 'Funil' },
    { id: 'clientes', icone: '👥', label: 'Clientes' },
    { id: 'agenda', icone: '📅', label: 'Agenda' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🏠</span>
        <span className="logo-text">Metah<span className="logo-destaque">Imob</span></span>
      </div>
      <nav className="sidebar-nav">
        {itens.map(item => (
          <button
            key={item.id}
            className={`nav-item ${tela === item.id ? 'active' : ''}`}
            onClick={() => setTela(item.id)}
          >
            <span className="nav-icone">{item.icone}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="sidebar-version">v1.0.0</span>
      </div>
    </aside>
  );
}