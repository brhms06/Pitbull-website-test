'use client';

import { useRef, useState } from 'react';

interface Props {
  /** Called with a PNG data URL after each stroke, or null once cleared/empty. */
  onChange: (dataUrl: string | null) => void;
  error?: string;
}

/** Draw-to-sign pad backed by a plain <canvas> — no signature library needed. */
export default function SignaturePad({ onChange, error }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  const ctx = () => canvasRef.current?.getContext('2d') ?? null;

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const c = ctx();
    if (!c) return;
    drawing.current = true;
    const { x, y } = pointerPos(e);
    c.beginPath();
    c.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const c = ctx();
    if (!c) return;
    const { x, y } = pointerPos(e);
    c.lineWidth = 2;
    c.lineCap = 'round';
    c.strokeStyle = '#1c3345';
    c.lineTo(x, y);
    c.stroke();
    setEmpty(false);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    onChange(canvas && !empty ? canvas.toDataURL('image/png') : null);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const c = ctx();
    if (canvas && c) c.clearRect(0, 0, canvas.width, canvas.height);
    setEmpty(true);
    onChange(null);
  };

  return (
    <div>
      <div className={`overflow-hidden rounded-2xl border-2 border-dashed bg-white ${error ? 'border-red-400' : 'border-sand'}`}>
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          className="h-[180px] w-full touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted">Sign above with your mouse, stylus or finger.</p>
        <button type="button" onClick={clear} className="text-xs font-semibold text-forest-700 underline hover:text-ember">
          Clear
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
