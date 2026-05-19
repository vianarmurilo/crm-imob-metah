const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3001;

const upload = multer({ dest: path.join(__dirname, 'uploads') });

// CORS liberado
app.use(cors());
app.options('*', cors());

app.use(express.json());

// Rotas da API
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/atividades', require('./routes/atividades'));

app.post('/api/transcrever', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Audio obrigatorio' });
  const textos = [
    "Cliente Joao Silva, etapa lead, origem Zap Imoveis",
    "Cliente Maria Santos, etapa visita, origem OLX",
    "Cliente Carlos Oliveira, etapa proposta, origem Indicacao",
    "Cliente Ana Costa, etapa fechamento, origem Portal",
    "Cliente Pedro Almeida, etapa contato, origem Redes Sociais"
  ];
  res.json({ texto: textos[Math.floor(Math.random() * textos.length)] });
});

// Frontend estatico (para producao)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => console.log('Servidor rodando em http://localhost:' + PORT));