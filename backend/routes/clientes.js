const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  try {
    const { etapa } = req.query;
    let rows;
    if (etapa) {
      rows = db.prepare('SELECT * FROM clientes WHERE etapa = ? ORDER BY data_cadastro DESC').all(etapa);
    } else {
      rows = db.prepare('SELECT * FROM clientes ORDER BY data_cadastro DESC').all();
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { nome, telefone, email, origem, etapa, proximo_contato, observacoes } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

    const stmt = db.prepare(
      'INSERT INTO clientes (nome, telefone, email, origem, etapa, proximo_contato, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(nome, telefone || '', email || '', origem || '', etapa || 'lead', proximo_contato || null, observacoes || '');

    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(Number(result.lastInsertRowid));

    const actStmt = db.prepare('INSERT INTO atividades (cliente_id, tipo, descricao) VALUES (?, ?, ?)');
    actStmt.run(Number(result.lastInsertRowid), 'cadastro', `Cliente ${nome} cadastrado como ${etapa || 'lead'}`);

    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { nome, telefone, email, origem, etapa, proximo_contato, observacoes } = req.body;
    const atual = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
    if (!atual) return res.status(404).json({ erro: 'Cliente não encontrado' });

    const stmt = db.prepare(
      'UPDATE clientes SET nome=?, telefone=?, email=?, origem=?, etapa=?, proximo_contato=?, observacoes=? WHERE id=?'
    );
    stmt.run(
      nome || atual.nome,
      telefone !== undefined ? telefone : atual.telefone,
      email !== undefined ? email : atual.email,
      origem !== undefined ? origem : atual.origem,
      etapa || atual.etapa,
      proximo_contato !== undefined ? proximo_contato : atual.proximo_contato,
      observacoes !== undefined ? observacoes : atual.observacoes,
      req.params.id
    );

    if (etapa && etapa !== atual.etapa) {
      const actStmt = db.prepare('INSERT INTO atividades (cliente_id, tipo, descricao) VALUES (?, ?, ?)');
      actStmt.run(req.params.id, 'etapa', `Cliente ${atual.nome} moveu de ${atual.etapa} para ${etapa}`);
    }

    res.json(db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
    db.prepare('DELETE FROM clientes WHERE id = ?').run(req.params.id);
    res.json({ mensagem: 'Cliente removido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;