// CTDD-CDSC SpeechID — API integration with Python CDSC backend

const API_URL = "https://ctdd-cdsc-speechid-1.onrender.com";



export interface CTDDFeatures {
  MDDV: number;
  CLTI: number;
  SRV: number;
  TDR: number;
}

// ✅ ADDED SILENCE + UNCERTAIN SUPPORT
export interface PredictionResult {
  label: 'HUMAN' | 'AI' | 'SILENCE' | 'UNCERTAIN';
  confidence: number;
  features: CTDDFeatures;
  timestamp: string;
}

export async function predictFromBackend(audioBlob: Blob): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.wav");

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const features: CTDDFeatures = {
    MDDV: data.features.MDDV,
    CLTI: data.features.CLTI,
    SRV: data.features.SRV,
    TDR: data.features.TDR,
  };

  return {
    label: data.label as 'HUMAN' | 'AI' | 'SILENCE' | 'UNCERTAIN',
    confidence: data.confidence,
    features,
    timestamp: new Date().toLocaleString(),
  };
}

export async function fileToBlob(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  return new Blob([buffer], { type: "audio/wav" });
}

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  return audioContext.decodeAudioData(arrayBuffer);
}

export function exportToCSV(history: PredictionResult[]): string {
  const headers = 'Time,Result,Confidence,MDDV,CLTI,SRV,TDR\n';

  const rows = history.map(r =>
    `${r.timestamp},${r.label},${r.confidence},${r.features.MDDV},${r.features.CLTI},${r.features.SRV},${r.features.TDR}`
  ).join('\n');

  return headers + rows;
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
