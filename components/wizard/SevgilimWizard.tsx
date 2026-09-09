"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import {
  SEVGILIM_THEMES,
  LETTER_TEMPLATES,
  UZR_REASONS,
  UZR_REASON_TEMPLATES,
  TAKLIF_PLACES,
  type ThemeId,
  type UzrReasonId,
  type TaklifPlaceId,
} from "@/lib/content";
import ScratchCard from "./ScratchCard";
import WipeReveal from "./WipeReveal";
import ShareResult from "./ShareResult";
import {
  GOLD_EMOJI,
  KEY_COLORS,
  ConfettiBurst,
  RainOverlay,
  FloatingHearts,
  ThemeIcon,
  makeConfettiParticles,
  type Particle,
} from "./effects";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_FORGIVE_FLOWERS = 6;

type Stage =
  | "theme"
  | "envelope"
  | "name"
  | "letter"
  | "bday_input"
  | "bday_card"
  | "bday_confetti"
  | "bday_scratch"
  | "uzr_input"
  | "uzr_window"
  | "uzr_rainbow"
  | "uzr_collage"
  | "taklif_input"
  | "taklif_card"
  | "taklif_map"
  | "taklif_response"
  | "love_name"
  | "love_lock"
  | "love_reveal"
  | "love_response";

const STAGE_LABEL: Record<Stage, string> = {
  theme: "Mavzu tanlash",
  envelope: "Konvert",
  name: "Ism kiritish",
  letter: "Xat yozish",
  bday_input: "Tabrik yozish",
  bday_card: "Tabrik kartasi",
  bday_confetti: "Tabriklash",
  bday_scratch: "Sovg'ani ochish",
  uzr_input: "Ism va sabab",
  uzr_window: "Kechirim yozish",
  uzr_rainbow: "Kechirim",
  uzr_collage: "Xotira",
  taklif_input: "Ism va joy",
  taklif_card: "Taklif kartasi",
  taklif_map: "Lokatsiya",
  taklif_response: "Javob",
  love_name: "Ism kiritish",
  love_lock: "Qulf va kalit",
  love_reveal: "Izhor",
  love_response: "Javob",
};

// Konvert bilan boshlanish animatsiyasi hozircha faqat "Shunchaki" mavzusi
// uchun tayyor. "Tug'ilgan kun" o'zining tabrik + konfetti + sovg'a ochish
// oqimiga, "Uzr so'rash" esa yomg'irli oyna + kamalak oqimiga ega. Qolgan
// mavzular keyinroq o'ziga xos boshlanish bilan to'ldiriladi — hozircha
// ular to'g'ridan-to'g'ri ism kiritishga o'tadi.
function flowFor(id: ThemeId | null): Stage[] {
  if (id === "shunchaki") return ["theme", "envelope", "name", "letter"];
  if (id === "tugilgan_kun")
    return ["theme", "bday_input", "bday_card", "bday_confetti", "bday_scratch"];
  if (id === "uzr")
    return ["theme", "uzr_input", "uzr_window", "uzr_rainbow", "uzr_collage"];
  if (id === "taklif")
    return ["theme", "taklif_input", "taklif_card", "taklif_map", "taklif_response"];
  if (id === "sevgi_izhori")
    return ["theme", "love_name", "love_lock", "love_reveal", "love_response"];
  return ["theme", "name", "letter"];
}

export default function SevgilimWizard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("theme");
  const [theme, setTheme] = useState<ThemeId | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messageTouched, setMessageTouched] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingLetter, setEditingLetter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [uzrReason, setUzrReason] = useState<UzrReasonId | null>(null);
  const [forgiveFlowers, setForgiveFlowers] = useState(0);
  const [meetPlace, setMeetPlace] = useState<TaklifPlaceId | null>(null);
  const [meetDate, setMeetDate] = useState("");
  const [meetTime, setMeetTime] = useState("");
  const [taklifResponse, setTaklifResponse] = useState<"accept" | "later" | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [loveResponse, setLoveResponse] = useState<"yes" | "thinking" | null>(null);
  const [resultSlug, setResultSlug] = useState<string | null>(null);

  function selectUzrReason(id: UzrReasonId) {
    setUzrReason(id);
    if (!messageTouched) setMessage(UZR_REASON_TEMPLATES[id]);
  }

  function launchConfetti() {
    setParticles(makeConfettiParticles());
    setStage("bday_confetti");
  }

  function respondTaklif(kind: "accept" | "later") {
    setTaklifResponse(kind);
    if (kind === "accept") setParticles(makeConfettiParticles());
  }

  function pickKey() {
    if (unlocking) return;
    setUnlocking(true);
    setTimeout(() => {
      setUnlocking(false);
      setStage("love_reveal");
    }, 700);
  }

  function respondLove(kind: "yes" | "thinking") {
    setLoveResponse(kind);
    if (kind === "yes") setParticles(makeConfettiParticles(GOLD_EMOJI));
  }

  function formattedMeetDate() {
    if (!meetDate) return "";
    const d = new Date(meetDate + "T00:00:00");
    return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });
  }

  function selectTheme(id: ThemeId) {
    setTheme(id);
    if (!messageTouched) setMessage(LETTER_TEMPLATES[id] ?? "");
    setStage(flowFor(id)[1]);
  }

  function goBack() {
    const flow = flowFor(theme);
    const idx = flow.indexOf(stage);
    if (idx <= 0) {
      router.push("/");
      return;
    }
    setStage(flow[idx - 1]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Faqat rasm fayli yuklash mumkin");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Rasm hajmi 5MB dan oshmasligi kerak");
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSend() {
    setError(null);
    setLoading(true);
    try {
      let image_url: string | null = null;
      if (imageFile) {
        const supabase = supabaseBrowser();
        const ext = imageFile.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("page-images")
          .upload(path, imageFile);
        if (uploadError) {
          setError("Rasm yuklanmadi: " + uploadError.message);
          setLoading(false);
          return;
        }
        const { data } = supabase.storage.from("page-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }

      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_name: name.trim(),
          recipient: "sevgilim",
          theme,
          message,
          image_url,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Nimadir xato ketdi");
        setLoading(false);
        return;
      }
      setLoading(false);
      setResultSlug(data.slug);
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
      setLoading(false);
    }
  }

  if (resultSlug) {
    return <ShareResult slug={resultSlug} name={name} />;
  }

  const flow = flowFor(theme);
  const stepLabel = `${flow.indexOf(stage) + 1}-qadam: ${STAGE_LABEL[stage]}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blush via-cream to-cardBlue/40">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <button
          onClick={goBack}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-rose/30 text-rose transition-colors hover:bg-rose/10"
          aria-label="Orqaga"
        >
          &larr;
        </button>
        <a href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose" />
          <span className="font-display text-lg text-ink">Mehrim</span>
        </a>
        <span className="hidden rounded-full bg-rose/10 px-4 py-1.5 text-xs font-semibold text-rose sm:inline-block">
          {stepLabel}
        </span>
        <nav className="flex items-center gap-2 text-xs text-ink/60 sm:gap-4 sm:text-sm">
          <a href="/" className="hover:text-ink">
            Bosh sahifa
          </a>
          <a href="/#qanday-ishlaydi" className="hover:text-ink">
            Yordam
          </a>
        </nav>
      </header>
      <span className="mx-auto block w-fit rounded-full bg-rose/10 px-4 py-1.5 text-xs font-semibold text-rose sm:hidden">
        {stepLabel}
      </span>

      {stage === "theme" && (
        <section className="mx-auto max-w-5xl px-6 py-12 text-center">
          <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-rose shadow-sm">
            SEVGILIM UCHUN
          </span>
          <h1 className="mt-4 font-display text-3xl text-ink md:text-4xl">
            Sevganingizga maxsus tabrik tayyorlang 💝
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            Har bir so'z, har bir munosabat o'ziga xos. Yaqiningizga eng mos
            keladigan maktub uslubi va mavzusini tanlang.
          </p>

          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-5">
            {SEVGILIM_THEMES.map((t) => {
              const selected = theme === t.id;
              return (
                <div
                  key={t.id}
                  className={`flex flex-col rounded-2xl p-5 transition-colors ${
                    selected ? "bg-rose text-white" : "bg-cardRose text-ink"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      selected ? "bg-white/25 text-white" : "bg-white/70 text-rose"
                    }`}
                  >
                    <ThemeIcon icon={t.icon} />
                  </span>
                  <p className="mt-4 font-display text-lg">{t.label}</p>
                  <p
                    className={`mt-2 flex-1 text-sm leading-relaxed ${
                      selected ? "text-white/85" : "text-ink/60"
                    }`}
                  >
                    {t.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => selectTheme(t.id)}
                    className={`focus-ring mt-5 rounded-full py-2 text-sm font-medium transition-colors ${
                      selected
                        ? "bg-white text-rose"
                        : "bg-white text-ink hover:bg-white/70"
                    }`}
                  >
                    {selected ? "Tanlangan" : "Tanlash"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {stage === "envelope" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
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
            onClick={() => setStage("name")}
            className="focus-ring mt-8 rounded-full bg-rose px-7 py-3 font-medium text-white transition-colors hover:bg-rose2"
          >
            Ochish uchun bosing
          </button>
        </section>
      )}

      {stage === "name" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16 sm:px-6 sm:py-24">
          <div className="w-full rounded-3xl bg-white p-6 text-center shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
            <h2 className="font-display text-2xl text-ink">
              Uning ismini yozing
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              Tabrik sahifasida sevganingizning ismi chiroyli shriftda namoyon
              bo'ladi.
            </p>
            <label className="mt-6 block text-left text-xs font-semibold tracking-wide text-rose">
              YAQINGIZNING ISMI
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Malika"
              className="focus-ring mt-2 w-full rounded-2xl border border-ink/15 px-4 py-3 text-ink placeholder:text-ink/40"
            />
            {error && <p className="mt-3 text-sm text-rose">{error}</p>}
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => {
                setError(null);
                setStage("letter");
              }}
              className="focus-ring mt-6 w-full rounded-full bg-rose py-3 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-50"
            >
              Davom etish
            </button>
          </div>
        </section>
      )}

      {stage === "letter" && (
        <section className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="rounded-3xl bg-white p-5 shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-rose">
                <ThemeIcon icon="heartFilled" />
              </span>
              <button
                type="button"
                onClick={goBack}
                className="focus-ring text-ink/40 hover:text-ink/70"
                aria-label="Orqaga"
              >
                ✕
              </button>
            </div>
            <h2 className="mt-3 font-display text-2xl italic text-ink">
              Azizim, {name.trim() || "..."}
            </h2>

            {editingLetter ? (
              <textarea
                autoFocus
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setMessageTouched(true);
                }}
                maxLength={400}
                rows={6}
                className="focus-ring mt-4 w-full resize-none rounded-xl border border-ink/10 bg-cream/40 p-3 font-display text-lg italic leading-relaxed text-ink/80"
              />
            ) : (
              <p className="mt-4 whitespace-pre-line font-display text-lg italic leading-relaxed text-ink/80">
                {message}
              </p>
            )}

            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt=""
                className="mt-4 h-24 w-24 rounded-xl object-cover"
              />
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-ink/25 px-4 py-3 text-sm text-ink/60 hover:border-rose/40 hover:text-ink sm:w-auto sm:py-2"
              >
                📷 Rasm qo'shish
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLetter((v) => !v)}
                  className="focus-ring flex-1 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-rose/40 sm:flex-none sm:py-2"
                >
                  {editingLetter ? "Saqlash" : "Tahrirlash"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSend}
                  className="focus-ring flex-1 rounded-full bg-rose px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-60 sm:flex-none sm:py-2"
                >
                  {loading ? "Yuborilmoqda…" : "Yuborish"}
                </button>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-rose">{error}</p>}
          </div>
        </section>
      )}

      {stage === "bday_input" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="font-display text-3xl text-ink">
            Tug'ilgan kun tabrigi
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-ink/70">
            Sevganingiz kayfiyatini yaxshi ko'tarishning eng yaxshi usuli —
            bu chiroyli tabrik.
          </p>

          <div className="mt-8 w-full rounded-3xl bg-white p-6 text-left shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
            <label className="block text-xs font-semibold tracking-wide text-rose">
              UNING ISMI
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Malika"
              className="focus-ring mt-2 w-full rounded-2xl border border-ink/15 px-4 py-3 text-ink placeholder:text-ink/40"
            />

            <label className="mt-5 block text-xs font-semibold tracking-wide text-rose">
              TABRIK MATNI
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setMessageTouched(true);
              }}
              maxLength={400}
              rows={4}
              className="focus-ring mt-2 w-full resize-none rounded-2xl border border-ink/15 p-3 text-ink"
            />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="focus-ring mt-4 rounded-full border border-dashed border-ink/25 px-4 py-2 text-sm text-ink/60 hover:border-rose/40 hover:text-ink"
              >
                + Rasm qo'shish (ixtiyoriy)
              </button>
            ) : (
              <div className="mt-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="focus-ring text-sm text-rose underline underline-offset-2"
                >
                  Olib tashlash
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {error && <p className="mt-3 text-sm text-rose">{error}</p>}

            <button
              type="button"
              disabled={!name.trim() || !message.trim()}
              onClick={() => {
                setError(null);
                setStage("bday_card");
              }}
              className="focus-ring mt-6 w-full rounded-full bg-rose py-3 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-50"
            >
              Davom etish &rarr;
            </button>
          </div>
        </section>
      )}

      {stage === "bday_card" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="font-display text-3xl text-ink">
            Sehrli tabrik kartasi
          </h1>
          <div className="mt-8 w-full rounded-3xl bg-white p-6 shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
            <p className="font-display text-xl italic text-rose">
              Azizim, {name.trim() || "..."}! 🎂
            </p>
            <div className="my-4 flex justify-center text-4xl">🎁</div>
            <p className="whitespace-pre-line leading-relaxed text-ink/70">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={launchConfetti}
            className="focus-ring mt-8 rounded-full bg-gradient-to-r from-coral to-gold px-8 py-3.5 font-medium text-white shadow-md transition-transform hover:scale-[1.03]"
          >
            Sovg'ani olish uchun bosing! 🎁
          </button>
        </section>
      )}

      {stage === "bday_confetti" && (
        <section className="relative mx-auto flex min-h-[70vh] max-w-md flex-col items-center overflow-hidden px-4 py-16 text-center sm:px-6">
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
            <p className="mt-4 font-medium text-ink">
              Siz uchun maxsus sovg'a bor!
            </p>
            <p className="mt-1 text-sm text-ink/60">
              Uni ochish uchun quyidagi tugmani bosing.
            </p>
            <button
              type="button"
              onClick={() => setStage("bday_scratch")}
              className="focus-ring mt-5 w-full rounded-full bg-ink py-3 font-medium text-white transition-colors hover:bg-ink/85"
            >
              Manzarani ko'ring! 🎁
            </button>
          </div>
        </section>
      )}

      {stage === "bday_scratch" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="font-display text-2xl text-ink">
            Rasmni ko'rish uchun o'chiring ✨
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Barmog'ingiz bilan bosib ushlab tortib, rasmni ochib chiqing.
          </p>

          <div className="mt-8">
            <ScratchCard
              imageUrl={imagePreview}
              onRevealed={() => setScratchRevealed(true)}
            />
          </div>

          {error && <p className="mt-4 text-sm text-rose">{error}</p>}

          {scratchRevealed && (
            <button
              type="button"
              disabled={loading}
              onClick={handleSend}
              className="focus-ring mt-6 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-60"
            >
              {loading ? "Yuborilmoqda…" : "Yuborish"}
            </button>
          )}
        </section>
      )}

      {stage === "uzr_input" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="font-display text-3xl text-ink">Kechirim so'rash</h1>
          <p className="mx-auto mt-3 max-w-sm text-ink/70">
            Uning ismini yozing va nima uchun kechirim so'rayotganingizni
            tanlang.
          </p>

          <div className="mt-8 w-full rounded-3xl bg-white p-6 text-left shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
            <label className="block text-xs font-semibold tracking-wide text-rose">
              UNING ISMI
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Malika"
              className="focus-ring mt-2 w-full rounded-2xl border border-ink/15 px-4 py-3 text-ink placeholder:text-ink/40"
            />

            <p className="mt-5 text-xs font-semibold tracking-wide text-rose">
              NIMA UCHUN UZR?
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {UZR_REASONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectUzrReason(r.id)}
                  className={`focus-ring rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    uzrReason === r.id
                      ? "border-ink bg-ink text-white"
                      : "border-ink/15 bg-white text-ink/70 hover:border-ink/30"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {error && <p className="mt-3 text-sm text-rose">{error}</p>}

            <button
              type="button"
              disabled={!name.trim() || !uzrReason}
              onClick={() => {
                setError(null);
                setStage("uzr_window");
              }}
              className="focus-ring mt-6 w-full rounded-full bg-rose py-3 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-50"
            >
              Davom etish
            </button>
          </div>
        </section>
      )}

      {stage === "uzr_window" && (
        <section className="relative mx-auto flex max-w-md flex-col items-center overflow-hidden px-4 py-12 text-center sm:px-6 sm:py-16">
          <RainOverlay />
          <h1 className="relative font-display text-2xl text-ink">
            Oynaga yozgan xatim...
          </h1>
          <p className="relative mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Nima yozganimni o'qish uchun oynani barmog'ingiz bilan arting.
          </p>

          <div className="relative mt-8 w-full max-w-xs rounded-3xl bg-gradient-to-b from-cardBlue to-white p-3 shadow-[0_30px_60px_-25px_rgba(92,122,154,0.45)]">
            <WipeReveal fogColor="rgba(214, 229, 240, 0.96)">
              <div className="flex min-h-[220px] w-full items-center justify-center rounded-2xl bg-white/70 p-6">
                {editingLetter ? (
                  <textarea
                    autoFocus
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setMessageTouched(true);
                    }}
                    maxLength={400}
                    rows={6}
                    className="focus-ring w-full resize-none rounded-xl border border-ink/10 bg-white p-3 font-display text-lg italic leading-relaxed text-ink/80"
                  />
                ) : (
                  <p className="whitespace-pre-line font-display text-lg italic leading-relaxed text-ink/80">
                    {message}
                  </p>
                )}
              </div>
            </WipeReveal>
          </div>

          <button
            type="button"
            onClick={() => setEditingLetter((v) => !v)}
            className="focus-ring relative mt-4 text-sm font-medium text-ink/60 underline underline-offset-2 hover:text-ink"
          >
            {editingLetter ? "Saqlash" : "Matnni tahrirlash"}
          </button>

          <button
            type="button"
            onClick={() => setStage("uzr_rainbow")}
            className="focus-ring relative mt-6 rounded-full bg-rose px-8 py-3 font-medium text-white transition-colors hover:bg-rose2"
          >
            Davom etish
          </button>
        </section>
      )}

      {stage === "uzr_rainbow" && (
        <section className="relative mx-auto flex max-w-md flex-col items-center overflow-hidden px-4 py-12 text-center sm:px-6 sm:py-16">
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
          <p className="relative mx-auto mt-3 max-w-xs text-ink/70">
            Kechirdingizmi? Har bosishda senga bitta gul sovg'a qilaman.
          </p>

          <div className="relative mt-10 flex h-40 items-end justify-center">
            {Array.from({ length: forgiveFlowers }).map((_, i) => {
              const offset = (i - (forgiveFlowers - 1) / 2) * 18;
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
              <path
                d="M20 30 L15 85 L65 85 L60 30 Z"
                fill="#C9A227"
                opacity="0.85"
              />
              <ellipse cx="40" cy="30" rx="22" ry="7" fill="#E7B24F" />
            </svg>
          </div>

          <button
            type="button"
            onClick={() =>
              setForgiveFlowers((f) => Math.min(f + 1, MAX_FORGIVE_FLOWERS))
            }
            className="focus-ring relative mt-4 rounded-full bg-rose px-7 py-3 font-medium text-white transition-colors hover:bg-rose2"
          >
            Kechirdingizmi? 🌸
          </button>

          <button
            type="button"
            disabled={forgiveFlowers < 1}
            onClick={() => setStage("uzr_collage")}
            className="focus-ring relative mt-4 rounded-full border border-ink/15 px-7 py-2.5 text-sm font-medium text-ink transition-colors hover:border-rose/40 disabled:opacity-40"
          >
            Davom etish
          </button>
        </section>
      )}

      {stage === "uzr_collage" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="font-display text-2xl text-ink">
            Bir umr yodda qolsin 💞
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Yoningizda saqlagan bir xotira rasmini yurak shaklida ulashing.
          </p>

          <div className="relative mt-8 h-56 w-64">
            <svg viewBox="0 0 200 180" className="h-full w-full">
              <defs>
                <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
                  <path d="M0.5,0.95 C0.5,0.95 0.05,0.6 0.05,0.35 C0.05,0.15 0.2,0.02 0.38,0.02 C0.46,0.02 0.5,0.08 0.5,0.12 C0.5,0.08 0.54,0.02 0.62,0.02 C0.8,0.02 0.95,0.15 0.95,0.35 C0.95,0.6 0.5,0.95 0.5,0.95 Z" />
                </clipPath>
              </defs>
              {imagePreview ? (
                <image
                  href={imagePreview}
                  x="0"
                  y="0"
                  width="200"
                  height="180"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#heartClip)"
                />
              ) : (
                <path
                  d="M100,171 C100,171 9,108 9,63 C9,27 36,3.6 68.4,3.6 C82.8,3.6 100,14.4 100,21.6 C100,14.4 117.2,3.6 131.6,3.6 C164,3.6 191,27 191,63 C191,108 100,171 100,171 Z"
                  fill="none"
                  stroke="#C97B86"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
              )}
            </svg>
          </div>

          {!imagePreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="focus-ring mt-4 rounded-full border border-dashed border-ink/25 px-4 py-2 text-sm text-ink/60 hover:border-rose/40 hover:text-ink"
            >
              + Xotira rasmini yuklash
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="focus-ring mt-4 text-sm text-rose underline underline-offset-2"
            >
              Rasmni almashtirish
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {error && <p className="mt-3 text-sm text-rose">{error}</p>}

          <button
            type="button"
            disabled={loading}
            onClick={handleSend}
            className="focus-ring mt-6 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-60"
          >
            {loading ? "Yuborilmoqda…" : "Yuborish"}
          </button>
        </section>
      )}

      {stage === "taklif_input" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="font-display text-3xl text-ink">
            Uchrashuvga taklif qiling
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-ink/70">
            Ismini, qayerda va qachon uchrashmoqchi ekaningizni belgilang.
          </p>

          <div className="mt-8 w-full rounded-3xl bg-white p-6 text-left shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
            <label className="block text-xs font-semibold tracking-wide text-rose">
              UNING ISMI
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Malika"
              className="focus-ring mt-2 w-full rounded-2xl border border-ink/15 px-4 py-3 text-ink placeholder:text-ink/40"
            />

            <p className="mt-5 text-xs font-semibold tracking-wide text-rose">
              QAYERDA?
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TAKLIF_PLACES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setMeetPlace(p.id)}
                  className={`focus-ring rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    meetPlace === p.id
                      ? "border-ink bg-ink text-white"
                      : "border-ink/15 bg-white text-ink/70 hover:border-ink/30"
                  }`}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold tracking-wide text-rose">
                  SANA
                </label>
                <input
                  type="date"
                  value={meetDate}
                  onChange={(e) => setMeetDate(e.target.value)}
                  className="focus-ring mt-2 w-full rounded-2xl border border-ink/15 px-3 py-3 text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide text-rose">
                  VAQT
                </label>
                <input
                  type="time"
                  value={meetTime}
                  onChange={(e) => setMeetTime(e.target.value)}
                  className="focus-ring mt-2 w-full rounded-2xl border border-ink/15 px-3 py-3 text-sm text-ink"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-rose">{error}</p>}

            <button
              type="button"
              disabled={!name.trim() || !meetPlace || !meetDate || !meetTime}
              onClick={() => {
                setError(null);
                const placeLabel =
                  TAKLIF_PLACES.find((p) => p.id === meetPlace)?.label ?? "";
                setMessage(
                  `${name.trim()}, seni uchrashuvga taklif qilaman!\n📍 ${placeLabel}\n📅 ${formattedMeetDate()}, ⏰ ${meetTime}`
                );
                setStage("taklif_card");
              }}
              className="focus-ring mt-6 w-full rounded-full bg-rose py-3 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-50"
            >
              Davom etish
            </button>
          </div>
        </section>
      )}

      {stage === "taklif_card" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="font-display text-3xl text-ink">
            Chiroyli taklif kartasi
          </h1>
          <div className="mt-8 w-full rounded-3xl bg-gradient-to-br from-cardRose via-cardPink to-cardPeach p-6 shadow-[0_30px_60px_-25px_rgba(201,123,134,0.4)] sm:p-8">
            <p className="text-3xl">💫</p>
            <p className="mt-3 font-display text-xl italic text-ink">
              {name.trim() || "..."}, seni uchrashuvga taklif qilaman
            </p>
            <div className="mx-auto mt-6 max-w-[220px] space-y-2 rounded-2xl bg-white/70 p-4 text-sm text-ink/80">
              <p>
                📍{" "}
                {TAKLIF_PLACES.find((p) => p.id === meetPlace)?.label ?? "—"}
              </p>
              <p>📅 {formattedMeetDate() || "—"}</p>
              <p>⏰ {meetTime || "—"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStage("taklif_map")}
            className="focus-ring mt-8 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2"
          >
            Davom etish
          </button>
        </section>
      )}

      {stage === "taklif_map" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="font-display text-2xl text-ink">Uchrashuv joyi</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            {TAKLIF_PLACES.find((p) => p.id === meetPlace)?.label} sizni
            kutmoqda.
          </p>

          <div className="relative mt-8 aspect-[4/3] w-full max-w-xs overflow-hidden rounded-3xl bg-cardGreen shadow-[0_30px_60px_-25px_rgba(140,166,120,0.45)]">
            <svg viewBox="0 0 300 225" className="h-full w-full">
              <rect width="300" height="225" fill="#DCEEDC" />
              {[40, 90, 140, 190, 240].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="225" stroke="#B8D3B4" strokeWidth="6" />
              ))}
              {[30, 80, 130, 180].map((y) => (
                <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#B8D3B4" strokeWidth="6" />
              ))}
              <circle cx="150" cy="112" r="10" fill="#6B2737" opacity="0.15" />
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[80%]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose text-white shadow-lg">
                <ThemeIcon icon="heartFilled" />
              </span>
              <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1 rotate-45 bg-rose" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStage("taklif_response")}
            className="focus-ring mt-8 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2"
          >
            Davom etish
          </button>
        </section>
      )}

      {stage === "taklif_response" && (
        <section className="relative mx-auto flex max-w-md flex-col items-center overflow-hidden px-4 py-12 text-center sm:px-6 sm:py-16">
          {taklifResponse === "accept" && <ConfettiBurst particles={particles} />}

          <h1 className="font-display text-2xl text-ink">
            U nima deb javob beradi?
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Havolani ochganda ko'rsatiladigan javob tugmalarini oldindan
            ko'ring.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => respondTaklif("accept")}
              className={`focus-ring rounded-full px-6 py-3 font-medium transition-colors ${
                taklifResponse === "accept"
                  ? "bg-rose text-white"
                  : "border border-ink/15 bg-white text-ink hover:border-rose/40"
              }`}
            >
              Qabul qilaman ❤️
            </button>
            <button
              type="button"
              onClick={() => respondTaklif("later")}
              className={`focus-ring rounded-full px-6 py-3 font-medium transition-colors ${
                taklifResponse === "later"
                  ? "bg-ink text-white"
                  : "border border-ink/15 bg-white text-ink hover:border-ink/30"
              }`}
            >
              Boshqa vaqtga 😊
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-rose">{error}</p>}

          {taklifResponse && (
            <button
              type="button"
              disabled={loading}
              onClick={handleSend}
              className="focus-ring mt-6 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-60"
            >
              {loading ? "Yuborilmoqda…" : "Yuborish"}
            </button>
          )}
        </section>
      )}

      {stage === "love_name" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="font-display text-3xl text-ink">Sevgi izhori</h1>
          <p className="mx-auto mt-3 max-w-sm text-ink/70">
            Kimga bo'lgan tuyg'ularingizni ochiq aytmoqchisiz?
          </p>

          <div className="mt-8 w-full rounded-3xl bg-white p-6 text-center shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
            <label className="block text-left text-xs font-semibold tracking-wide text-rose">
              UNING ISMI
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Malika"
              className="focus-ring mt-2 w-full rounded-2xl border border-ink/15 px-4 py-3 text-ink placeholder:text-ink/40"
            />
            {error && <p className="mt-3 text-sm text-rose">{error}</p>}
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => {
                setError(null);
                setStage("love_lock");
              }}
              className="focus-ring mt-6 w-full rounded-full bg-rose py-3 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-50"
            >
              Davom etish
            </button>
          </div>
        </section>
      )}

      {stage === "love_lock" && (
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="font-display text-2xl text-ink">
            Yuragimning kalitini toping 🔐
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Uchta kalitdan birini tanlang — biri albatta mos keladi.
          </p>

          <div
            className={`mt-10 text-7xl text-rose ${unlocking ? "lock-opening" : ""}`}
          >
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
        </section>
      )}

      {stage === "love_reveal" && (
        <section className="relative mx-auto flex max-w-md flex-col items-center overflow-hidden px-4 py-12 text-center sm:px-6 sm:py-16">
          <FloatingHearts />

          <h1 className="relative font-display text-2xl text-ink">
            Qulf ochildi... 💖
          </h1>

          <div className="relative mt-6 w-full rounded-3xl bg-white p-6 shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
            <p className="font-display text-xl italic text-rose">
              Azizim, {name.trim() || "..."}
            </p>

            {editingLetter ? (
              <textarea
                autoFocus
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setMessageTouched(true);
                }}
                maxLength={400}
                rows={6}
                className="focus-ring mt-4 w-full resize-none rounded-xl border border-ink/10 bg-cream/40 p-3 font-display text-lg italic leading-relaxed text-ink/80"
              />
            ) : (
              <p className="mt-4 whitespace-pre-line font-display text-lg italic leading-relaxed text-ink/80">
                {message}
              </p>
            )}

            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt=""
                className="mx-auto mt-4 h-24 w-24 rounded-xl object-cover"
              />
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="focus-ring text-ink/60 underline underline-offset-2 hover:text-ink"
              >
                {imagePreview ? "Rasmni almashtirish" : "+ Rasm qo'shish"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => setEditingLetter((v) => !v)}
                className="focus-ring text-ink/60 underline underline-offset-2 hover:text-ink"
              >
                {editingLetter ? "Saqlash" : "Matnni tahrirlash"}
              </button>
            </div>
          </div>

          {error && <p className="relative mt-3 text-sm text-rose">{error}</p>}

          <button
            type="button"
            onClick={() => setStage("love_response")}
            className="focus-ring relative mt-6 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2"
          >
            Davom etish
          </button>
        </section>
      )}

      {stage === "love_response" && (
        <section className="relative mx-auto flex max-w-md flex-col items-center overflow-hidden px-4 py-12 text-center sm:px-6 sm:py-16">
          {loveResponse === "yes" && <ConfettiBurst particles={particles} />}

          <h1 className="font-display text-2xl text-ink">
            U qanday javob beradi? 💭
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Havolani ochganda ko'rsatiladigan javob tugmalarini oldindan
            ko'ring.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => respondLove("yes")}
              className={`focus-ring rounded-full px-6 py-3 font-medium transition-colors ${
                loveResponse === "yes"
                  ? "bg-gold text-white"
                  : "border border-ink/15 bg-white text-ink hover:border-gold/50"
              }`}
            >
              Ha ❤️
            </button>
            <button
              type="button"
              onClick={() => respondLove("thinking")}
              className={`focus-ring rounded-full px-6 py-3 font-medium transition-colors ${
                loveResponse === "thinking"
                  ? "bg-ink text-white"
                  : "border border-ink/15 bg-white text-ink hover:border-ink/30"
              }`}
            >
              O'ylab ko'raman 😊
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-rose">{error}</p>}

          {loveResponse && (
            <button
              type="button"
              disabled={loading}
              onClick={handleSend}
              className="focus-ring mt-6 rounded-full bg-rose px-8 py-3.5 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-60"
            >
              {loading ? "Yuborilmoqda…" : "Yuborish"}
            </button>
          )}
        </section>
      )}
    </main>
  );
}
