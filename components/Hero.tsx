export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, #F6D9DC, transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-4 md:grid-cols-2 md:gap-10 md:pt-10">
        <div>
          <span className="text-xs font-semibold tracking-wide text-rose">
            MEHRINGIZNI BILDIRING
          </span>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.1] text-ink md:text-[3.4rem]">
            Aytolmagan gapingizni,
            <br />
            <span className="text-rose">bitta sahifa</span> aytib
            <br />
            bersin.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            Sevganlaringizga maxsus tabriklar va sovg'alar yuboring. &ldquo;Mehrim&rdquo;
            orqali masofalar yaqinlashadi, qalblar birlashadi.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#kategoriyalar"
              className="focus-ring rounded-full bg-rose px-7 py-3.5 font-medium text-white transition-colors hover:bg-rose2"
            >
              Boshlash
            </a>
            <a
              href="#qanday-ishlaydi"
              className="focus-ring rounded-full border border-ink/15 px-7 py-3.5 font-medium text-ink/80 transition-colors hover:border-rose/40 hover:text-ink"
            >
              Qanday ishlaydi?
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-cardRose via-cardPink to-cardPeach shadow-[0_40px_70px_-30px_rgba(201,123,134,0.45)]">
            <svg viewBox="0 0 400 300" className="h-full w-full">
              <defs>
                <radialGradient id="hero-glow" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFF7F1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FFF7F1" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="400" height="300" fill="url(#hero-glow)" />

              {/* envelope with wax seal */}
              <g transform="translate(120 150)">
                <rect
                  x="0"
                  y="0"
                  width="160"
                  height="105"
                  rx="6"
                  fill="#F7EDE4"
                  stroke="#D8B8A2"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 4 L80 60 L160 4"
                  fill="none"
                  stroke="#D8B8A2"
                  strokeWidth="1.5"
                />
                <circle cx="80" cy="52" r="14" fill="#C9A227" opacity="0.9" />
                <circle cx="80" cy="52" r="6" fill="#F7EDE4" opacity="0.85" />
              </g>

              {/* candle */}
              <g transform="translate(300 110)">
                <rect x="-14" y="30" width="28" height="55" rx="4" fill="#E7B24F" />
                <ellipse cx="0" cy="30" rx="14" ry="5" fill="#F3C877" />
                <path
                  d="M0 -6 Q6 6 0 16 Q-6 6 0 -6Z"
                  fill="#F6A15E"
                />
                <path d="M0 4 Q3 10 0 16 Q-3 10 0 4Z" fill="#FCE0A6" />
              </g>

              {/* roses */}
              {[
                [60, 70, 26, "#E8607A"],
                [95, 40, 20, "#F2879C"],
                [220, 60, 22, "#C97B86"],
                [330, 200, 24, "#E8607A"],
                [50, 220, 22, "#F2879C"],
                [255, 230, 18, "#B96872"],
              ].map(([cx, cy, r, fill], i) => (
                <g key={i} transform={`translate(${cx} ${cy})`}>
                  {[0, 60, 120, 180, 240, 300].map((a) => (
                    <ellipse
                      key={a}
                      cx="0"
                      cy={-(r as number) * 0.55}
                      rx={(r as number) * 0.4}
                      ry={(r as number) * 0.6}
                      fill={fill as string}
                      opacity="0.85"
                      transform={`rotate(${a})`}
                    />
                  ))}
                  <circle r={(r as number) * 0.3} fill="#C9A227" opacity="0.9" />
                </g>
              ))}

              {/* leaves */}
              {[
                [130, 30],
                [280, 40],
                [20, 150],
                [370, 260],
              ].map(([x, y], i) => (
                <path
                  key={i}
                  d={`M${x} ${y} q10 -16 20 0 q-10 16 -20 0Z`}
                  fill="#8CA678"
                  opacity="0.7"
                  transform={`rotate(${(i * 53) % 360} ${x} ${y})`}
                />
              ))}
            </svg>
          </div>
          <div className="absolute -bottom-6 -left-6 -z-10 h-full w-full rounded-[28px] bg-rose/15" />
        </div>
      </div>
    </section>
  );
}
