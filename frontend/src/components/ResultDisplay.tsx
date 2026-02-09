import { motion } from "framer-motion";
import type { PredictionResult } from "@/lib/audio-utils";

interface ResultDisplayProps {
  result: PredictionResult | null;
}

const labelConfig: Record<string, { icon: string; className: string; text: string }> = {
  HUMAN: {
    icon: "👤",
    className: "result-badge-human",
    text: "HUMAN SPEECH"
  },

  AI: {
    icon: "🤖",
    className: "result-badge-ai",
    text: "AI-SYNTHESIZED"
  },

  // ✅ ADDED SILENCE SUPPORT
  SILENCE: {
    icon: "🔇",
    className: "result-badge-silence",
    text: "NO SPEECH DETECTED"
  },

  // ✅ ADDED UNCERTAIN SUPPORT
  UNCERTAIN: {
    icon: "⚠️",
    className: "result-badge-uncertain",
    text: "UNCERTAIN RESULT"
  }
};

const featureLabels: Record<string, string> = {
  MDDV: "Micro-Decision Delay Variability",
  CLTI: "Cognitive Load Transition Index",
  SRV: "Speech Rate Variability",
  TDR: "Terminal Decision Relaxation",
};

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  if (!result) return null;

  // ✅ NO MORE “default to AI”
  const config = labelConfig[result.label] || labelConfig.UNCERTAIN;

  const isHuman = result.label === "HUMAN";
  const isSilence = result.label === "SILENCE";

  // Confidence should be 0 for silence
  const displayConfidence = isSilence ? 0 : result.confidence * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="space-y-5"
    >
      {/* Result Badge */}
      <div className="flex justify-center">
        <div className={`${config.className} px-8 py-4 rounded-2xl text-center`}>
          <span className="text-4xl block mb-1">{config.icon}</span>
          <span className="text-2xl font-black tracking-wide">
            {config.text}
          </span>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-mono">
          <span className="text-muted-foreground">CDSC Confidence</span>
          <span className="text-foreground font-semibold">
            {displayConfidence.toFixed(1)}%
          </span>
        </div>

        <div className="progress-bar-container h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${displayConfidence}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}

            className={`h-full rounded-full ${
              isSilence
                ? "bg-gray-400"
                : isHuman
                ? "progress-bar-fill-human"
                : "progress-bar-fill-ai"
            }`}
          />
        </div>
      </div>

      {/* Hide features if SILENCE */}
      {!isSilence && (
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-xs font-mono text-primary uppercase tracking-wider">
              CTDD Feature Values
            </p>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Full Name</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(result.features).map(([key, val]) => (
                <tr key={key}>
                  <td className="text-primary font-semibold">{key}</td>

                  <td className="text-muted-foreground text-xs">
                    {featureLabels[key] || key}
                  </td>

                  <td className="text-foreground">
                    {typeof val === "number" ? val.toFixed(6) : val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ResultDisplay;
