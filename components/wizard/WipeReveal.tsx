"use client";

import { useEffect, useRef, useState } from "react";

const REVEAL_THRESHOLD = 0.35;

// Foydalanuvchi barmog'i bilan "artib" pastdagi mazmunni ochadigan tuman
// pardasi. ScratchCard'ga o'xshaydi, lekin ostida rasm emas — istalgan
// bola elementi (masalan matn) bo'lishi mumkin.
export default function WipeReveal({
  children,
  fogColor = "rgba(214, 229, 240, 0.94)",
}: {
  children: React.ReactNode;
  fogColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wiping = useRef(false);
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

    ctx.fillStyle = fogColor;
    ctx.fillRect(0, 0, w, h);

    function pos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function wipeAt(x: number, y: number) {
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.beginPath();
      ctx!.arc(x, y, 34, 0, Math.PI * 2);
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
        let sampled = 0;
        for (let i = 3; i < data.length; i += 32) {
          sampled++;
          if (data[i] === 0) cleared++;
        }
        if (sampled > 0 && cleared / sampled > REVEAL_THRESHOLD) {
          revealedRef.current = true;
          setFaded(true);
        }
      });
    }

    function onDown(e: PointerEvent) {
      wiping.current = true;
      const { x, y } = pos(e);
      wipeAt(x, y);
    }
    function onMove(e: PointerEvent) {
      if (!wiping.current) return;
      const { x, y } = pos(e);
      wipeAt(x, y);
      checkProgress();
    }
    function onUp() {
      wiping.current = false;
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
  }, [fogColor]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl"
    >
      {children}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${
          faded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      />
      {!faded && (
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-ink/40">
          barmog'ingiz bilan arting
        </span>
      )}
    </div>
  );
}
