import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { predictFromBackend, decodeAudioFile, type PredictionResult } from "@/lib/audio-utils";
import ResultDisplay from "./ResultDisplay";
import WaveformPreview from "./WaveformPreview";

interface UploadTabProps {
  onResult: (result: PredictionResult) => void;
}

const UploadTab = ({ onResult }: UploadTabProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".wav")) {
      setFile(f);
      setResult(null);
      setAudioBuffer(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      // Decode for waveform preview
      const buffer = await decodeAudioFile(file);
      setAudioBuffer(buffer);

      // Send to CDSC backend
      const prediction = await predictFromBackend(file);
      setResult(prediction);
      onResult(prediction);
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to connect to CDSC backend. Is it running on localhost:5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Upload Area */}
      <div
        onClick={() => inputRef.current?.click()}
        className="glass-card p-8 text-center cursor-pointer hover:border-primary/40 transition-colors border border-dashed border-border"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".wav"
          onChange={handleFile}
          className="hidden"
        />
        <div className="text-4xl mb-3">🎙️</div>
        <p className="text-foreground font-semibold">
          {file ? file.name : "Click to upload WAV file"}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Only .wav files are supported
        </p>
      </div>

      {/* Predict Button */}
      {file && (
        <button
          onClick={handlePredict}
          disabled={loading}
          className="btn-primary w-full py-3 rounded-xl font-semibold text-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending to CDSC...
            </span>
          ) : (
            "🔍 Predict via CDSC"
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="glass-card p-4 border border-destructive/50 text-destructive text-sm font-mono">
          ⚠️ {error}
        </div>
      )}

      <WaveformPreview audioBuffer={audioBuffer} />
      <ResultDisplay result={result} />
    </motion.div>
  );
};

export default UploadTab;
