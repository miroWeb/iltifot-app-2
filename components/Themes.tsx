import { RECIPIENTS, CARD_BG, RecipientId } from "@/lib/content";

function CardArt({ id }: { id: RecipientId }) {
  switch (id) {
    case "sevgilim":
      return (
        <svg viewBox="0 0 100 75" className="h-full w-full">
          <defs>
            <linearGradient id="art-sun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6A15E" />
              <stop offset="100%" stopColor="#E8607A" />
            </linearGradient>
          </defs>
          <rect width="100" height="75" fill="#F3D2D3" />
          <circle cx="50" cy="34" r="15" fill="url(#art-sun)" opacity="0.85" />
          <rect y="46" width="100" height="29" fill="#C97B86" opacity="0.25" />
          <path
            d="M40 55 Q40 42 47 42 Q50 42 50 47 Q50 42 53 42 Q60 42 60 55 Q60 62 50 68 Q40 62 40 55Z"
            fill="#6B2737"
            opacity="0.75"
          />
        </svg>
      );
    case "ona":
      return (
        <svg viewBox="0 0 100 75" className="h-full w-full">
          <rect width="100" height="75" fill="#FBDDE6" />
          <g transform="translate(50 38)">
            <circle r="16" fill="#B96872" opacity="0.18" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx="0"
                cy="-9"
                rx="6"
                ry="10"
                fill="#C97B86"
                opacity="0.75"
                transform={`rotate(${a})`}
              />
            ))}
            <circle r="4.5" fill="#C9A227" />
          </g>
          <path
            d="M50 54 Q47 62 50 70"
            stroke="#8A9A6B"
            strokeWidth="1.6"
            fill="none"
          />
        </svg>
      );
    case "ota":
      return (
        <svg viewBox="0 0 100 75" className="h-full w-full">
          <rect width="100" height="75" fill="#DCE6F3" />
          <path
            d="M-5 20 Q25 5 50 20 T105 20"
            stroke="#5C7A9A"
            strokeWidth="3"
            fill="none"
            opacity="0.55"
          />
          <path
            d="M-5 40 Q25 25 50 40 T105 40"
            stroke="#2B1B1F"
            strokeWidth="3"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M-5 60 Q25 45 50 60 T105 60"
            stroke="#8FA9C4"
            strokeWidth="3"
            fill="none"
            opacity="0.55"
          />
        </svg>
      );
    case "aka":
      return (
        <svg viewBox="0 0 100 75" className="h-full w-full">
          <rect width="100" height="75" fill="#DCEEDC" />
          {[
            [16, 16],
            [50, 10],
            [84, 20],
            [26, 44],
            [62, 40],
            [90, 52],
            [12, 62],
            [46, 66],
            [78, 60],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M${x} ${y} q6 -10 12 0 q-6 10 -12 0Z`}
              fill="#6E9268"
              opacity={0.5 + (i % 3) * 0.15}
              transform={`rotate(${(i * 37) % 360} ${x} ${y})`}
            />
          ))}
        </svg>
      );
    case "dost":
      return (
        <svg viewBox="0 0 100 75" className="h-full w-full">
          <rect width="100" height="75" fill="#F8E8C8" />
          <circle cx="42" cy="38" r="16" fill="none" stroke="#C9A227" strokeWidth="4" opacity="0.85" />
          <circle cx="58" cy="38" r="16" fill="none" stroke="#E8607A" strokeWidth="4" opacity="0.75" />
        </svg>
      );
    case "opa":
      return (
        <svg viewBox="0 0 100 75" className="h-full w-full">
          <rect width="100" height="75" fill="#E7DCF3" />
          <circle cx="34" cy="30" r="14" fill="#B79BD1" opacity="0.5" />
          <circle cx="58" cy="24" r="10" fill="#8A3348" opacity="0.25" />
          <circle cx="62" cy="46" r="16" fill="#C97B86" opacity="0.35" />
          <circle cx="34" cy="50" r="10" fill="#6B2737" opacity="0.2" />
        </svg>
      );
    case "uka":
      return (
        <svg viewBox="0 0 100 75" className="h-full w-full">
          <rect width="100" height="75" fill="#D8EEE9" />
          <rect x="32" y="34" width="36" height="28" rx="2" fill="#4F9C8C" opacity="0.8" />
          <rect x="32" y="34" width="36" height="8" fill="#2B1B1F" opacity="0.15" />
          <rect x="47" y="20" width="6" height="42" fill="#F8E8C8" opacity="0.9" />
          <path
            d="M50 20 Q40 8 32 16 Q34 24 50 20Z"
            fill="#F8E8C8"
            opacity="0.9"
          />
          <path
            d="M50 20 Q60 8 68 16 Q66 24 50 20Z"
            fill="#F8E8C8"
            opacity="0.9"
          />
        </svg>
      );
    case "singil":
      return (
        <svg viewBox="0 0 100 75" className="h-full w-full">
          <rect width="100" height="75" fill="#F7DED2" />
          {[
            [28, 30],
            [50, 22],
            [72, 34],
            [40, 50],
            [62, 52],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="0"
                  cy="-5"
                  rx="3.5"
                  ry="5.5"
                  fill="#E8607A"
                  opacity="0.6"
                  transform={`rotate(${a})`}
                />
              ))}
              <circle r="2" fill="#C9A227" />
            </g>
          ))}
        </svg>
      );
  }
}

export default function Themes() {
  return (
    <section id="kategoriyalar" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="inline-block rounded-full bg-rose/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-rose">
          KATEGORIYALAR
        </span>
        <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
          Yaqinlaringiz uchun maxsus
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-ink/70">
          Har bir yaqiningizning o'ziga xos xarakteri va rangi bor. Ularga eng
          mosini tanlang.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
          {RECIPIENTS.map((r) => (
            <a
              key={r.id}
              href={`/?kimga=${r.id}`}
              className={`focus-ring group overflow-hidden rounded-2xl ${CARD_BG[r.id]} transition-transform hover:-translate-y-1`}
            >
              <div className="m-3 aspect-[4/3] overflow-hidden rounded-xl">
                <CardArt id={r.id} />
              </div>
              <div className="flex items-center justify-between px-4 pb-4">
                <span className="font-medium text-ink">{r.label}</span>
                <span className="text-ink/50 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
