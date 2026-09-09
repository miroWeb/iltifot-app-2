"use client";

import { useState } from "react";

export const CONFETTI_EMOJI = ["🌸", "🌷", "💐", "🎁", "🎀"];
export const GOLD_EMOJI = ["✨", "🌟", "💛", "⭐"];
export const KEY_COLORS = ["text-rose", "text-gold", "text-wine"] as const;

export type Particle = { id: number; emoji: string; dx: number; dy: number; rot: number; delay: number };
type RainDrop = { id: number; left: number; duration: number; delay: number };
type FloatHeart = { id: number; left: number; duration: number; delay: number; size: number };

export function makeConfettiParticles(emojiPool: string[] = CONFETTI_EMOJI): Particle[] {
  return Array.from({ length: 24 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 160;
    return {
      id: i,
      emoji: emojiPool[Math.floor(Math.random() * emojiPool.length)],
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 40,
      rot: Math.random() * 360 - 180,
      delay: Math.random() * 0.25,
    };
  });
}

export function ConfettiBurst({ particles }: { particles: Particle[] }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle text-2xl"
          style={
            {
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

function makeRainDrops(count: number): RainDrop[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 0.7 + Math.random() * 0.8,
    delay: Math.random() * 1.5,
  }));
}

export function RainOverlay({ count = 40 }: { count?: number }) {
  const [drops] = useState(() => makeRainDrops(count));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {drops.map((d) => (
        <span
          key={d.id}
          className="rain-drop"
          style={{
            left: `${d.left}%`,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function makeFloatHearts(count: number): FloatHeart[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    duration: 3 + Math.random() * 2.5,
    delay: Math.random() * 3,
    size: 14 + Math.random() * 14,
  }));
}

export function FloatingHearts({ count = 14 }: { count?: number }) {
  const [hearts] = useState(() => makeFloatHearts(count));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-float text-rose/70"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  );
}

export type IconName = "heart" | "spark" | "heartFilled" | "star" | "cake";

export function ThemeIcon({ icon }: { icon: IconName }) {
  const common = { viewBox: "0 0 24 24", className: "h-5 w-5" } as const;
  switch (icon) {
    case "heart":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 20.5s-7.5-4.6-9.8-9.2C.8 8.1 2.4 4.8 5.7 4.2c2-.4 3.9.5 5 2.1 1.1-1.6 3-2.5 5-2.1 3.3.6 4.9 3.9 3.5 7.1-2.3 4.6-9.8 9.2-9.8 9.2Z" />
        </svg>
      );
    case "heartFilled":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 20.5s-7.5-4.6-9.8-9.2C.8 8.1 2.4 4.8 5.7 4.2c2-.4 3.9.5 5 2.1 1.1-1.6 3-2.5 5-2.1 3.3.6 4.9 3.9 3.5 7.1-2.3 4.6-9.8 9.2-9.8 9.2Z" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2c.6 3.8 1.6 6 3 7.4S18.6 11.4 22 12c-3.8.6-6 1.6-7.4 3S12.6 18.6 12 22c-.6-3.8-1.6-6-3-7.4S5.4 12.6 2 12c3.8-.6 6-1.6 7.4-3S11.4 5.4 12 2Z" />
        </svg>
      );
    case "star":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.7l-6.1 3.3 1.5-6.8-5.2-4.7 6.9-.7L12 2.5Z" />
        </svg>
      );
    case "cake":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 21v-6a3 3 0 013-3h10a3 3 0 013 3v6" />
          <path d="M2 21h20" />
          <path d="M12 12V7" />
          <path d="M12 4c-.9 0-1.6-.7-1.6-1.6S12 1 12 1s1.6.6 1.6 1.4S12.9 4 12 4Z" />
        </svg>
      );
  }
}
