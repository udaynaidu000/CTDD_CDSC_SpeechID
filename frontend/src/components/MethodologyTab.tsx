import { motion } from "framer-motion";

const steps = [
  {
    title: "1. Audio Input",
    icon: "🎙️",
    description:
      "Raw speech audio is captured via WAV file upload or live browser recording. The signal is preprocessed to ensure consistent sampling rate and format.",
  },
  {
    title: "2. CTDD Feature Extraction",
    icon: "📊",
    description:
      "Four Cognitive Temporal Decision Dynamics (CTDD) features are extracted from the audio signal:",
    features: [
      { label: "MDDV", name: "Micro-Decision Delay Variability", desc: "Measures the variance in micro-level temporal hesitation patterns inherent in human speech production." },
      { label: "CLTI", name: "Cognitive Load Transition Index", desc: "Captures transitions in cognitive effort across speech segments, reflecting natural mental processing." },
      { label: "SRV", name: "Speech Rate Variability", desc: "Quantifies fluctuations in speech delivery rate, a hallmark of organic human articulation." },
      { label: "TDR", name: "Terminal Decision Relaxation", desc: "Analyzes the relaxation patterns at phrase boundaries, indicative of natural cognitive closure." },
    ],
  },
  {
    title: "3. Feature Normalization",
    icon: "⚙️",
    description:
      "Extracted CTDD features are normalized using a fitted StandardScaler (loaded from models/live_scaler.pkl) to ensure consistent scale across all dimensions before classification.",
  },
  {
    title: "4. CDSC Classification",
    icon: "🧠",
    description:
      "The Cognitive Deviation Scoring Classifier (CDSC) uses Mahalanobis distance to measure how far the normalized feature vector deviates from learned class centroids (HUMAN vs AI). The class with the shorter Mahalanobis distance determines the prediction, with confidence derived from the relative distances.",
  },
  {
    title: "5. Decision Output",
    icon: "✅",
    description:
      "The system outputs: a classification label (HUMAN or AI), a confidence score (0–1), and the individual CTDD feature values for transparency and interpretability.",
  },
];

const MethodologyTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold gradient-text mb-2">System Pipeline</h2>
        <p className="text-muted-foreground text-sm">
          Audio → CTDD Extraction → Normalization → CDSC (Mahalanobis) → HUMAN / AI
        </p>
      </div>

      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">{step.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>

              {step.features && (
                <div className="mt-4 grid gap-3">
                  {step.features.map((f) => (
                    <div key={f.label} className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary font-mono font-bold text-sm">{f.label}</span>
                        <span className="text-foreground text-sm font-semibold">— {f.name}</span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-2">Model Files</h3>
        <div className="grid gap-2 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="text-primary">📦</span>
            <span className="text-muted-foreground">models/live_cdsc.pkl</span>
            <span className="text-foreground/40">— CDSC classifier model</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">📦</span>
            <span className="text-muted-foreground">models/live_scaler.pkl</span>
            <span className="text-foreground/40">— Feature normalizer</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MethodologyTab;
