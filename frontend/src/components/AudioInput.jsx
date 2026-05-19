import React, { useState, useRef } from 'react';
import { transcreverAudio } from '../api';

export default function AudioInput({ onTranscrito }) {
  const [gravando, setGravando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const iniciar = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setCarregando(true);
        try {
          const result = await transcreverAudio(blob);
          if (result.texto) onTranscrito(result.texto);
        } catch (err) {
          alert('Erro ao transcrever áudio');
        }
        setCarregando(false);
      };

      mediaRecorder.start();
      setGravando(true);
    } catch (err) {
      alert('Permita acesso ao microfone para usar este recurso');
    }
  };

  const parar = () => {
    if (mediaRef.current && mediaRef.current.state === 'recording') {
      mediaRef.current.stop();
      setGravando(false);
    }
  };

  return (
    <div className="audio-input">
      {carregando ? (
        <span className="audio-carregando">🔄 Transcrevendo...</span>
      ) : gravando ? (
        <button className="btn-audio gravando" onClick={parar}>
          <span className="audio-pulso"></span>
          🎤 Gravando...
        </button>
      ) : (
        <button className="btn-audio" onClick={iniciar} title="Gravar áudio para preencher dados">
          🎤 Áudio
        </button>
      )}
    </div>
  );
}