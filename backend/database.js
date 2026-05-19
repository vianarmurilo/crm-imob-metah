const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'crm-metah.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    origem TEXT DEFAULT '',
    etapa TEXT DEFAULT 'lead',
    data_cadastro TEXT DEFAULT (date('now')),
    proximo_contato TEXT,
    observacoes TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS atividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    descricao TEXT DEFAULT '',
    data_hora TEXT DEFAULT (datetime('now', '-3 hours')),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
  );
`);

module.exports = db;