const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  try {
    if (req.query.cliente_id) {
      const rows = db.prepare('SELECT * FROM atividades WHERE cliente_id = ? ORDER BY data_hora DESC').all(req.query.cliente_id);
      return res.json(rows);
    }
    const rows = db.prepare(
      'SELECT a.*, c.nome FROM atividades a JOIN clientes c ON a.cliente_id = c.id ORDER BY a.data_hora DESC LIMIT 50'
    ).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { cliente_id, tipo, descricao } = req.body;
    if (!cliente_id || !tipo) return res.status(400).json({ erro: 'cliente_id e tipo são obrigatórios' });
    const stmt = db.prepare('INSERT INTO atividades (cliente_id, tipo, descricao) VALUES (?, ?, ?)');
    const result = stmt.run(cliente_id, tipo, descricao || '');
    res.status(201).json({ id: Number(result.lastInsertRowid) });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;