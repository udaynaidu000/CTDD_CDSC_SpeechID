import { useEffect, useRef } from "react";

interface WaveformPreviewProps {
  audioBuffer: AudioBuffer | null;
}

const WaveformPreview = ({ audioBuffer }: WaveformPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / rect.width);
    const amp = rect.height / 2;

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
    gradient.addColorStop(0, "hsl(199, 89%, 48%)");
    gradient.addColorStop(0.5, "hsl(250, 60%, 55%)");
    gradient.addColorStop(1, "hsl(160, 84%, 39%)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < rect.width; i++) {
      let min = 1.0, max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j] || 0;
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      const yMin = (1 + min) * amp;
      const yMax = (1 + max) * amp;
      ctx.moveTo(i, yMin);
      ctx.lineTo(i, yMax);
    }

    ctx.stroke();
  }, [audioBuffer]);

  if (!audioBuffer) return null;

  return (
    <div className="glass-card p-4">
      <p className="text-xs font-mono text-muted-foreground mb-2">WAVEFORM</p>
      <canvas
        ref={canvasRef}
        className="w-full h-20 rounded-md"
        style={{ display: "block" }}
      />
    </div>
  );
};

export default WaveformPreview;
