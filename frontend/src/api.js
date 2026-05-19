const API = 'http://localhost:3001/api';

export async function getClientes(etapa = null) {
  const url = etapa ? `${API}/clientes?etapa=${etapa}` : `${API}/clientes`;
  const res = await fetch(url);
  return res.json();
}

export async function getCliente(id) {
  const res = await fetch(`${API}/clientes/${id}`);
  return res.json();
}

export async function criarCliente(dados) {
  const res = await fetch(`${API}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return res.json();
}

export async function atualizarCliente(id, dados) {
  const res = await fetch(`${API}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return res.json();
}

export async function deletarCliente(id) {
  const res = await fetch(`${API}/clientes/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function getAtividades(clienteId = null) {
  const url = clienteId ? `${API}/atividades?cliente_id=${clienteId}` : `${API}/atividades`;
  const res = await fetch(url);
  return res.json();
}

export async function transcreverAudio(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'gravacao.webm');
  const res = await fetch(`${API}/transcrever`, { method: 'POST', body: formData });
  return res.json();
}