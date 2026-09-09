"use client";

import { useEffect, useRef, useState } from "react";

const REVEAL_THRESHOLD = 0.5; // 50% qirilganda to'liq ochiladi

export default function ScratchCard({
  imageUrl,
  onRevealed,
}: {
  imageUrl: string | null;
  onRevealed: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);
  const revealedRef = useRef(false);
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = "#6B2737";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#C9A227";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const cx = w / 2;
    const cy = h / 2;
    const s = Math.min(w, h) * 0.22;
    ctx.strokeRect(cx - s, cy - s, s * 2, s * 2);
    ctx.beginPath();
    ctx.moveTo(cx - s, cy + s * 0.35);
    ctx.lineTo(cx - s * 0.25, cy - s * 0.15);
    ctx.lineTo(cx + s * 0.15, cy + s * 0.35);
    ctx.lineTo(cx + s * 0.45, cy - s * 0.05);
    ctx.lineTo(cx + s, cy + s * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + s * 0.45, cy - s * 0.45, s * 0.16, 0, Math.PI * 2);
    ctx.stroke();

    function pos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function scratchAt(x: number, y: number) {
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.beginPath();
      ctx!.arc(x, y, 26, 0, Math.PI * 2);
      ctx!.fill();
    }

    let checkScheduled = false;
    function checkProgress() {
      if (checkScheduled || revealedRef.current) return;
      checkScheduled = true;
      requestAnimationFrame(() => {
        checkScheduled = false;
        const data = ctx!.getImageData(0, 0, w, h).data;
        let cleared = 0;
        const step = 4 * 8; // har 8-pikselni tekshiramiz (tezlik uchun)
        let sampled = 0;
        for (let i = 3; i < data.length; i += step) {
          sampled++;
          if (data[i] === 0) cleared++;
        }
        if (sampled > 0 && cleared / sampled > REVEAL_THRESHOLD) {
          revealedRef.current = true;
          setFaded(true);
          onRevealed();
        }
      });
    }

    function onDown(e: PointerEvent) {
      scratching.current = true;
      const { x, y } = pos(e);
      scratchAt(x, y);
    }
    function onMove(e: PointerEvent) {
      if (!scratching.current) return;
      const { x, y } = pos(e);
      scratchAt(x, y);
      checkProgress();
    }
    function onUp() {
      scratching.current = false;
      checkProgress();
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-xs overflow-hidden rounded-3xl bg-gradient-to-br from-cardAmber via-cardPeach to-cardRose shadow-[0_30px_60px_-25px_rgba(201,123,134,0.5)]"
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-6xl">🎁</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${
          faded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
