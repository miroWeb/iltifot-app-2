"use client";

import { useState } from "react";
import type { PageRecord } from "@/lib/supabase";
import {
  RainOverlay,
  FloatingHearts,
  ConfettiBurst,
  ThemeIcon,
  KEY_COLORS,
  GOLD_EMOJI,
  makeConfettiParticles,
  type Particle,
} from "@/components/wizard/effects";
import ScratchCard from "@/components/wizard/ScratchCard";
import WipeReveal from "@/components/wizard/WipeReveal";
import { GRADIENT, THEME_COPY, type ThemeId, type ColorId } from "@/lib/content";

const HEART_CLIP_PATH =
  "M0.5,0.95 C0.5,0.95 0.05,0.6 0.05,0.35 C0.05,0.15 0.2,0.02 0.38,0.02 C0.46,0.02 0.5,0.08 0.5,0.12 C0.5,0.08 0.54,0.02 0.62,0.02 C0.8,0.02 0.95,0.15 0.95,0.35 C0.95,0.6 0.5,0.95 0.5,0.95 Z";

const SALUTATION: Record<string, string> = {
  sevgilim: "Azizim",
  dost: "Do'stim",
  ona: "Onajonim",
  ota: "Dadajonim",
  aka: "Akajonim",
  opa: "Opajonim",
  uka: "Ukajonim",
  singil: "Singlim",
};

function salutationFor(recipient: string): string {
  return SALUTATION[recipient] ?? "Salom";
}

function useRespond(slug: string) {
  const [submitting, setSubmitting] = useState(false);
  async function respond(value: string): Promise<string> {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/pages/${slug}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: value }),
      });
      const data = await res.json();
      return (data.response as string) ?? value;
    } finally {
      setSubmitting(false);
    }
  }
  return { respond, submitting };
}

function ShunchakiReveal({ page }: { page: PageRecord }) {
  const [opened, setOpened] = useState(false);

  if (!opened) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="relative aspect-[4/3] w-full max-w-xs rounded-3xl bg-cardRose shadow-[0_30px_60px_-25px_rgba(201,123,134,0.5)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose text-white shadow-md">
              <ThemeIcon icon="heartFilled" />
            </span>
          </div>
          <div
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-3xl bg-white/40"
            style={{ clipPath: "polygon(0 0, 50% 65%, 100% 0)" }}
          />
        </div>
        <button
          type="button"
          onClick={() => setOpened(true)}
          className="focus-ring mt-8 rounded-full bg-rose px-7 py-3 font-medium text-white transition-colors hover:bg-rose2"
        >
          Ochish uchun bosing
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
      <p className="font-display text-xl italic text-rose">
        {salutationFor(page.recipient)}, {page.recipient_name}
      </p>
      {page.message && (
        <p className="mt-4 whitespace-pre-line font-display text-lg italic leading-relaxed text-ink/80">
          {page.message}
        </p>
      )}
      {page.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={page.image_url}
          alt=""
          className="mx-auto mt-6 h-28 w-28 rounded-full object-cover"
        />
      )}
    </div>
  );
}

function BirthdayReveal({ page }: { page: PageRecord }) {
  const [stage, setStage] = useState<"card" | "confetti" | "scratch">("card");
  const [particles, setParticles] = useState<Particle[]>([]);

  function openGift() {
    setParticles(makeConfettiParticles());
    setStage("confetti");
  }

  if (stage === "card") {
    return (
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="w-full rounded-3xl bg-white p-6 shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
          <p className="font-display text-xl italic text-rose">
            {salutationFor(page.recipient)}, {page.recipient_name}! 🎂
          </p>
          <div className="my-4 flex justify-center text-4xl">🎁</div>
          {page.message && (
            <p className="whitespace-pre-line leading-relaxed text-ink/70">
              {page.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={openGift}
          className="focus-ring mt-8 rounded-full bg-gradient-to-r from-coral to-gold px-8 py-3.5 font-medium text-white shadow-md transition-transform hover:scale-[1.03]"
        >
          Sovg'ani olish uchun bosing! 🎁
        </button>
      </div>
    );
  }

  if (stage === "confetti") {
    return (
      <div className="relative flex min-h-[60vh] w-full max-w-md flex-col items-center overflow-hidden text-center">
        <ConfettiBurst particles={particles} />
        <h1 className="font-display text-3xl text-coral">
          Tug'ilgan kuningiz muborak! 🎉
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-ink/70">
          Sizga tilaganlarim behad ko'p ekanligini bilib qo'ying.
        </p>
        <div className="relative mt-8 w-full max-w-xs rounded-3xl bg-white p-6 shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cardAmber text-3xl">
            🎁
          </div>
          <p className="mt-4 font-medium text-ink">Siz uchun maxsus sovg'a bor!</p>
          <button
            type="button"
            onClick={() => setStage("scratch")}
            className="focus-ring mt-5 w-full rounded-full bg-ink py-3 font-medium text-white transition-colors hover:bg-ink/85"
          >
            Manzarani ko'ring! 🎁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <h1 className="font-display text-2xl text-ink">
        Rasmni ko'rish uchun o'chiring ✨
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
        Barmog'ingiz bilan bosib ushlab tortib, rasmni ochib chiqing.
      </p>
      <div className="mt-8">
        <ScratchCard imageUrl={page.image_url} onRevealed={() => {}} />
      </div>
    </div>
  );
}

function UzrReveal({ page }: { page: PageRecord }) {
  const [stage, setStage] = useState<"window" | "rainbow">("window");
  const [flowers, setFlowers] = useState(page.response === "forgiven" ? 1 : 0);
  const [responded, setResponded] = useState(page.response === "forgiven");
  const { respond, submitting } = useRespond(page.slug);

  async function handleForgive() {
    if (responded) {
      setFlowers((f) => Math.min(f + 1, 6));
      return;
    }
    setResponded(true);
    setFlowers(1);
    await respond("forgiven");
  }

  if (stage === "window") {
    return (
      <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden text-center">
        <RainOverlay />
        <h1 className="relative font-display text-2xl text-ink">
          Senga yozilgan xat...
        </h1>
        <p className="relative mx-auto mt-2 max-w-xs text-sm text-ink/60">
          O'qish uchun oynani barmog'ingiz bilan arting.
        </p>
        <div className="relative mt-8 w-full max-w-xs rounded-3xl bg-gradient-to-b from-cardBlue to-white p-3 shadow-[0_30px_60px_-25px_rgba(92,122,154,0.45)]">
          <WipeReveal fogColor="rgba(214, 229, 240, 0.96)">
            <div className="flex min-h-[220px] w-full items-center justify-center rounded-2xl bg-white/70 p-6">
              <p className="whitespace-pre-line font-display text-lg italic leading-relaxed text-ink/80">
                {page.message}
              </p>
            </div>
          </WipeReveal>
        </div>
        <button
          type="button"
          onClick={() => setStage("rainbow")}
          className="focus-ring relative mt-6 rounded-full bg-rose px-8 py-3 font-medium text-white transition-colors hover:bg-rose2"
        >
          Davom etish
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden text-center">
      <svg
        viewBox="0 0 300 150"
        className="pointer-events-none absolute -top-4 left-1/2 h-40 w-[420px] -translate-x-1/2 opacity-90"
      >
        <path d="M10 150 A140 140 0 0 1 290 150" fill="none" stroke="#E8607A" strokeWidth="10" />
        <path d="M28 150 A122 122 0 0 1 272 150" fill="none" stroke="#F3C877" strokeWidth="10" />
        <path d="M46 150 A104 104 0 0 1 254 150" fill="none" stroke="#8FA9C4" strokeWidth="10" />
        <path d="M64 150 A86 86 0 0 1 236 150" fill="none" stroke="#8CA678" strokeWidth="10" />
      </svg>

      <h1 className="relative mt-14 font-display text-3xl text-ink">
        Yomg'ir tindi... 🌈
      </h1>
      <p className="relative mx-auto mt-3 max-w-xs text-ink/70">Kechirdingizmi?</p>

      <div className="relative mt-10 flex h-40 items-end justify-center">
        {Array.from({ length: flowers }).map((_, i) => {
          const offset = (i - (flowers - 1) / 2) * 18;
          return (
            <span
              key={i}
              className="bloom-pop absolute bottom-16 text-3xl"
              style={{ left: `calc(50% + ${offset}px)` }}
            >
              🌷
            </span>
          );
        })}
        <svg viewBox="0 0 80 90" className="h-24 w-20">
          <path d="M20 30 L15 85 L65 85 L60 30 Z" fill="#C9A227" opacity="0.85" />
          <ellipse cx="40" cy="30" rx="22" ry="7" fill="#E7B24F" />
        </svg>
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={handleForgive}
        className="focus-ring relative mt-4 rounded-full bg-rose px-7 py-3 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-60"
      >
        Kechirdingizmi? 🌸
      </button>

      {responded && page.image_url && (
        <div className="relative mt-8 h-40 w-40">
          <svg viewBox="0 0 200 180" className="h-full w-full">
            <defs>
              <clipPath id="heartClipUzr" clipPathUnits="objectBoundingBox">
                <path d={HEART_CLIP_PATH} />
              </clipPath>
            </defs>
            <image
              href={page.image_url}
              x="0"
              y="0"
              width="200"
              height="180"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#heartClipUzr)"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function TaklifReveal({ page }: { page: PageRecord }) {
  const [stage, setStage] = useState<"card" | "map" | "response">("card");
  const [response, setResponseState] = useState(page.response);
  const [particles, setParticles] = useState<Particle[]>([]);
  const { respond, submitting } = useRespond(page.slug);

  async function handleRespond(kind: "accept" | "later") {
    if (response) return;
    setResponseState(kind);
    if (kind === "accept") setParticles(makeConfettiParticles());
    const final = await respond(kind);
    setResponseState(final);
  }

  if (stage === "card") {
    return (
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <h1 className="font-display text-3xl text-ink">Sizga taklif bor 💫</h1>
        <div className="mt-8 w-full rounded-3xl bg-gradient-to-br from-cardRose via-cardPink to-cardPeach p-6 shadow-[0_30px_60px_-25px_rgba(201,123,134,0.4)] sm:p-8">
          <p className="text-3xl">💫</p>
          <p className="mt-3 font-display text-xl italic text-ink">
            {page.recipient_name}, seni uchrashuvga taklif qilaman
          </p>
          {page.message && (
            <p className="mx-auto mt-4 max-w-[220px] whitespace-pre-line rounded-2xl bg-white/70 p-4 text-sm text-ink/80">
              {page.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setStage("map")}
          className="focus-ring mt-8 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2"
        >
          Davom etish
        </button>
      </div>
    );
  }

  if (stage === "map") {
    return (
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <h1 className="font-display text-2xl text-ink">Uchrashuv joyi</h1>
        <div className="relative mt-8 aspect-[4/3] w-full max-w-xs overflow-hidden rounded-3xl bg-cardGreen shadow-[0_30px_60px_-25px_rgba(140,166,120,0.45)]">
          <svg viewBox="0 0 300 225" className="h-full w-full">
            <rect width="300" height="225" fill="#DCEEDC" />
            {[40, 90, 140, 190, 240].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="225" stroke="#B8D3B4" strokeWidth="6" />
            ))}
            {[30, 80, 130, 180].map((y) => (
              <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#B8D3B4" strokeWidth="6" />
            ))}
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[80%]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose text-white shadow-lg">
              <ThemeIcon icon="heartFilled" />
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStage("response")}
          className="focus-ring mt-8 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2"
        >
          Davom etish
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden text-center">
      {response === "accept" && <ConfettiBurst particles={particles} />}
      <h1 className="font-display text-2xl text-ink">Javobingiz</h1>
      {!response ? (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleRespond("accept")}
            className="focus-ring rounded-full border border-ink/15 bg-white px-6 py-3 font-medium text-ink transition-colors hover:border-rose/40 disabled:opacity-60"
          >
            Qabul qilaman ❤️
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleRespond("later")}
            className="focus-ring rounded-full border border-ink/15 bg-white px-6 py-3 font-medium text-ink transition-colors hover:border-ink/30 disabled:opacity-60"
          >
            Boshqa vaqtga 😊
          </button>
        </div>
      ) : (
        <p className="relative mt-6 text-lg text-ink/80">
          {response === "accept"
            ? "Siz taklifni qabul qildingiz! ❤️"
            : "Siz \"boshqa vaqtga\" deb javob berdingiz 😊"}
        </p>
      )}
    </div>
  );
}

function LoveReveal({ page }: { page: PageRecord }) {
  const [stage, setStage] = useState<"lock" | "reveal" | "response">("lock");
  const [unlocking, setUnlocking] = useState(false);
  const [response, setResponseState] = useState(page.response);
  const [particles, setParticles] = useState<Particle[]>([]);
  const { respond, submitting } = useRespond(page.slug);

  function pickKey() {
    if (unlocking) return;
    setUnlocking(true);
    setTimeout(() => {
      setUnlocking(false);
      setStage("reveal");
    }, 700);
  }

  async function handleRespond(kind: "yes" | "thinking") {
    if (response) return;
    setResponseState(kind);
    if (kind === "yes") setParticles(makeConfettiParticles(GOLD_EMOJI));
    const final = await respond(kind);
    setResponseState(final);
  }

  if (stage === "lock") {
    return (
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <h1 className="font-display text-2xl text-ink">
          Yuragimning kalitini toping 🔐
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
          Uchta kalitdan birini tanlang.
        </p>
        <div className={`mt-10 text-7xl text-rose ${unlocking ? "lock-opening" : ""}`}>
          🔒
        </div>
        <div className="mt-10 flex gap-5">
          {KEY_COLORS.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={pickKey}
              disabled={unlocking}
              className={`focus-ring text-4xl transition-transform hover:-translate-y-1 disabled:opacity-50 ${c}`}
              aria-label="Kalitni tanlash"
            >
              🗝️
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "reveal") {
    return (
      <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden text-center">
        <FloatingHearts />
        <h1 className="relative font-display text-2xl text-ink">
          Qulf ochildi... 💖
        </h1>
        <div className="relative mt-6 w-full rounded-3xl bg-white p-6 shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
          <p className="font-display text-xl italic text-rose">
            Azizim, {page.recipient_name}
          </p>
          {page.message && (
            <p className="mt-4 whitespace-pre-line font-display text-lg italic leading-relaxed text-ink/80">
              {page.message}
            </p>
          )}
          {page.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.image_url}
              alt=""
              className="mx-auto mt-4 h-24 w-24 rounded-xl object-cover"
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => setStage("response")}
          className="focus-ring relative mt-6 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2"
        >
          Davom etish
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden text-center">
      {response === "yes" && <ConfettiBurst particles={particles} />}
      <h1 className="font-display text-2xl text-ink">Javobingiz</h1>
      {!response ? (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleRespond("yes")}
            className="focus-ring rounded-full border border-ink/15 bg-white px-6 py-3 font-medium text-ink transition-colors hover:border-gold/50 disabled:opacity-60"
          >
            Ha ❤️
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleRespond("thinking")}
            className="focus-ring rounded-full border border-ink/15 bg-white px-6 py-3 font-medium text-ink transition-colors hover:border-ink/30 disabled:opacity-60"
          >
            O'ylab ko'raman 😊
          </button>
        </div>
      ) : (
        <p className="relative mt-6 text-lg text-ink/80">
          {response === "yes" ? "Ha dedingiz! 💛" : "\"O'ylab ko'raman\" dedingiz 😊"}
        </p>
      )}
    </div>
  );
}

function GenericReveal({ page }: { page: PageRecord }) {
  const copy = THEME_COPY[page.theme as ThemeId] ?? THEME_COPY.shunchaki;
  const gradient = GRADIENT[(page.color as ColorId) || "coral"] ?? GRADIENT.coral;
  return (
    <div
      className={`flex w-full max-w-md flex-col items-center rounded-3xl bg-gradient-to-br ${gradient} px-6 py-14 text-center`}
    >
      <p className="font-display text-sm italic text-cream/70">
        {page.recipient_name}ga {copy.eyebrow}
      </p>
      <h1 className="mt-4 max-w-lg font-display text-3xl leading-tight text-cream">
        {copy.line1}
        <br />
        {copy.line2}
      </h1>
      {page.message && (
        <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/90">
          {page.message}
        </p>
      )}
      {page.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={page.image_url}
          alt=""
          className="mt-10 h-32 w-32 rounded-full object-cover ring-4 ring-cream/30"
        />
      )}
    </div>
  );
}

export default function RevealExperience({ page }: { page: PageRecord }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blush via-cream to-cardBlue/40 px-4 py-10">
      <div className="flex w-full flex-col items-center">
        {page.theme === "shunchaki" && <ShunchakiReveal page={page} />}
        {page.theme === "tugilgan_kun" && <BirthdayReveal page={page} />}
        {page.theme === "uzr" && <UzrReveal page={page} />}
        {page.theme === "taklif" && <TaklifReveal page={page} />}
        {page.theme === "sevgi_izhori" && <LoveReveal page={page} />}
        {!["shunchaki", "tugilgan_kun", "uzr", "taklif", "sevgi_izhori"].includes(
          page.theme
        ) && <GenericReveal page={page} />}

        <p className="mt-10 text-center text-xs text-ink/40">
          Iltifot orqali yuborildi 💌
        </p>
      </div>
    </main>
  );
}
