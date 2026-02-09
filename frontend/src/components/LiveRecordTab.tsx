import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { predictFromBackend, type PredictionResult } from "@/lib/audio-utils";
import ResultDisplay from "./ResultDisplay";

interface LiveRecordTabProps {
  onResult: (result: PredictionResult) => void;
}

const LiveRecordTab = ({ onResult }: LiveRecordTabProps) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to record");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setLoading(true);
        setStatus("Sending to CDSC backend...");
        setError(null);

        try {
          // Convert recording to WAV-compatible blob
          const blob = new Blob(chunks.current, { type: "audio/wav" });
          const prediction = await predictFromBackend(blob);
          setResult(prediction);
          onResult(prediction);
          setStatus("Analysis complete");
        } catch (err: any) {
          console.error("Recording analysis error:", err);
          setError(err.message || "Failed to connect to CDSC backend.");
          setStatus("Error — check backend");
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      setRecording(true);
      setResult(null);
      setError(null);
      setStatus("🔴 Recording...");
    } catch {
      setStatus("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Record Button */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={loading}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition-all ${
            recording
              ? "bg-destructive/20 border-2 border-destructive recording-indicator"
              : "glass-card hover:border-primary/40 border border-border"
          }`}
        >
          {recording ? "⏹️" : "🎙️"}
        </button>

        <p className="text-sm font-mono text-muted-foreground">{status}</p>

        {!recording && !loading && (
          <button
            onClick={startRecording}
            className="btn-primary px-8 py-3 rounded-xl font-semibold"
          >
            Start Recording
          </button>
        )}

        {recording && (
          <button
            onClick={stopRecording}
            className="btn-secondary px-8 py-3 rounded-xl font-semibold"
          >
            Stop & Analyze
          </button>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-primary">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing via CDSC...
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card p-4 border border-destructive/50 text-destructive text-sm font-mono">
          ⚠️ {error}
        </div>
      )}

      <ResultDisplay result={result} />
    </motion.div>
  );
};

export default LiveRecordTab;
