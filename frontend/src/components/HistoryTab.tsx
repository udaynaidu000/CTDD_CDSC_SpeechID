import { motion } from "framer-motion";
import { exportToCSV, downloadCSV, type PredictionResult } from "@/lib/audio-utils";

interface HistoryTabProps {
  history: PredictionResult[];
  onClear: () => void;
}

const labelStyle: Record<string, string> = {
  HUMAN: "text-human",
  AI: "text-ai",
};

const HistoryTab = ({ history, onClear }: HistoryTabProps) => {
  const handleDownload = () => {
    const csv = exportToCSV(history);
    downloadCSV(csv, `speechid_results_${Date.now()}.csv`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleDownload}
          disabled={history.length === 0}
          className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-30"
        >
          📥 Download CSV
        </button>
        <button
          onClick={onClear}
          disabled={history.length === 0}
          className="btn-secondary px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-30"
        >
          🗑️ Clear History
        </button>
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground text-lg">No predictions yet</p>
          <p className="text-muted-foreground/60 text-sm mt-1">
            Upload or record audio to get started
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>MDDV</th>
                <th>CLTI</th>
                <th>SRV</th>
                <th>TDR</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r, i) => (
                <tr key={i}>
                  <td className="text-muted-foreground whitespace-nowrap">{r.timestamp}</td>
                  <td>
                    <span className={`font-bold ${labelStyle[r.label] || ""}`}>
                      {r.label}
                    </span>
                  </td>
                  <td>{(r.confidence * 100).toFixed(1)}%</td>
                  <td>{typeof r.features.MDDV === 'number' ? r.features.MDDV.toFixed(6) : r.features.MDDV}</td>
                  <td>{typeof r.features.CLTI === 'number' ? r.features.CLTI.toFixed(6) : r.features.CLTI}</td>
                  <td>{typeof r.features.SRV === 'number' ? r.features.SRV.toFixed(6) : r.features.SRV}</td>
                  <td>{typeof r.features.TDR === 'number' ? r.features.TDR.toFixed(6) : r.features.TDR}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTab;
