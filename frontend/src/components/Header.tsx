import { motion } from "framer-motion";

const featureBadges = [
  { label: "MDDV", desc: "Micro-Decision Delay Variability" },
  { label: "CLTI", desc: "Cognitive Load Transition Index" },
  { label: "SRV", desc: "Speech Rate Variability" },
  { label: "TDR", desc: "Terminal Decision Relaxation" },
];

const Header = () => {
  return (
    <header className="text-center py-10 px-4">
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm font-mono text-primary tracking-widest uppercase mb-2"
      >
        CTDD-CDSC SpeechID
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight gradient-text mb-4 leading-tight"
      >
        CTDD features based machine learning techniques for discriminating human and AI synthesized voices
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-muted-foreground text-base max-w-2xl mx-auto mb-5"
      >
        Cognitive Temporal Decision Dynamics with Cognitive Deviation Scoring Classifier
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {featureBadges.map((f) => (
          <span
            key={f.label}
            title={f.desc}
            className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20 cursor-help"
          >
            {f.label}
          </span>
        ))}
        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-secondary/10 text-secondary border border-secondary/20">
          CDSC Classifier
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-accent/10 text-accent border border-accent/20">
          Proposed Model
        </span>
      </motion.div>
    </header>
  );
};

export default Header;
