const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001;

const upload = multer({ dest: path.join(__dirname, 'uploads') });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/atividades', require('./routes/atividades'));

app.post('/api/transcrever', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Arquivo de áudio obrigatório' });
  
  // 🔧 Para usar transcrição real com OpenAI Whisper:
  // 1. npm install openai
  // 2. Crie um arquivo .env com OPENAI_API_KEY=sua_chave
  // 3. Use: const response = await openai.audio.transcriptions.create({ file, model: 'whisper-1' })
  
  const textoSimulado = `Cliente ${['João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Almeida'][Math.floor(Math.random() * 5)]}, etapa ${['lead', 'contato', 'visita', 'proposta', 'fechamento'][Math.floor(Math.random() * 5)]}, origem ${['Zap Imóveis', 'OLX', 'Indicação', 'Portal', 'Redes Sociais'][Math.floor(Math.random() * 5)]}`;
  
  res.json({ texto: textoSimulado });
});

app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});