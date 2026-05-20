const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(origin => origin.trim()).filter(Boolean);

const upload = multer({ dest: path.join(__dirname, 'uploads') });

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}));
app.options('*', cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'crm-imob-metah-backend' });
});

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

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));