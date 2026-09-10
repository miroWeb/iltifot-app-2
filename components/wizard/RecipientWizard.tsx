"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { compressImage } from "@/lib/compressImage";
import { LETTER_TEMPLATES } from "@/lib/content";
import type { RecipientWizardConfig, WizardThemeId } from "@/lib/wizardConfig";
import ScratchCard from "./ScratchCard";
import ShareResult from "./ShareResult";
import { ConfettiBurst, ThemeIcon, makeConfettiParticles, type Particle } from "./effects";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

type Stage =
  | "theme"
  | "envelope"
  | "name"
  | "letter"
  | "bday_input"
  | "bday_card"
  | "bday_confetti"
  | "bday_scratch";

const STAGE_LABEL: Record<Stage, string> = {
  theme: "Mavzu tanlash",
  envelope: "Konvert",
  name: "Ism kiritish",
  letter: "Xat yozish",
  bday_input: "Tabrik yozish",
  bday_card: "Tabrik kartasi",
  bday_confetti: "Tabriklash",
  bday_scratch: "Sovg'ani ochish",
};

// "Shunchaki" konvert ochish bilan boshlanadi, "Minnatdorchilik" to'g'ridan-to'g'ri
// ism va xat yozishga o'tadi, "Tug'ilgan kun" esa o'z tabrik+konfetti+sovg'a
// ochish oqimiga ega.
function flowFor(id: WizardThemeId | null): Stage[] {
  if (id === "shunchaki") return ["theme", "envelope", "name", "letter"];
  if (id === "minnatdorchilik") return ["theme", "name", "letter"];
  if (id === "tugilgan_kun")
    return ["theme", "bday_input", "bday_card", "bday_confetti", "bday_scratch"];
  return ["theme"];
}

export default function RecipientWizard({ config }: { config: RecipientWizardConfig }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("theme");
  const [theme, setTheme] = useState<WizardThemeId | null>(null);
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
  const [resultSlug, setResultSlug] = useState<string | null>(null);

  function launchConfetti() {
    setParticles(makeConfettiParticles());
    setStage("bday_confetti");
  }

  function selectTheme(id: WizardThemeId) {
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
        let blob: Blob = imageFile;
        let ext = imageFile.name.split(".").pop() || "jpg";
        try {
          blob = await compressImage(imageFile);
          ext = "jpg";
        } catch {
          // Siqib bo'lmasa, original faylni yuklaymiz
        }
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("page-images")
          .upload(path, blob, { contentType: blob.type || "image/jpeg" });
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
          recipient: config.recipient,
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
  const gridCols = config.themes.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <main className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
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
          <span className="font-display text-lg text-ink">Iltifot</span>
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
        <section className="mx-auto max-w-4xl px-6 py-12 text-center">
          <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-rose shadow-sm">
            {config.eyebrow}
          </span>
          <h1 className="mt-4 font-display text-3xl text-ink md:text-4xl">
            {config.heading}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">{config.subtext}</p>

          <div className={`mt-10 grid gap-4 text-left ${gridCols}`}>
            {config.themes.map((t) => {
              const selected = theme === t.id;
              return (
                <div
                  key={t.id}
                  className={`flex flex-col rounded-2xl p-5 transition-colors ${
                    selected ? "bg-rose text-white" : `${config.cardBg} text-ink`
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
          <div
            className={`relative aspect-[4/3] w-full max-w-xs rounded-3xl ${config.cardBg} ${config.shadowClass}`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose text-white shadow-md">
                <ThemeIcon icon="heart" />
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
          <div className={`w-full rounded-3xl bg-white p-6 text-center sm:p-8 ${config.shadowClass}`}>
            <h2 className="font-display text-2xl text-ink">Ismini yozing</h2>
            <p className="mt-2 text-sm text-ink/60">
              Tabrik sahifasida ismi chiroyli shriftda namoyon bo'ladi.
            </p>
            <label className="mt-6 block text-left text-xs font-semibold tracking-wide text-rose">
              {config.nameLabel}
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={config.namePlaceholder}
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
          <div className={`rounded-3xl bg-white p-5 sm:p-8 ${config.shadowClass}`}>
            <div className="flex items-center justify-between">
              <span className="text-rose">
                <ThemeIcon icon="heart" />
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
              {config.salutation}, {name.trim() || "..."}
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
          <h1 className="font-display text-3xl text-ink">Tug'ilgan kun tabrigi</h1>
          <p className="mx-auto mt-3 max-w-sm text-ink/70">
            Kayfiyatini ko'tarishning eng yaxshi usuli — bu chiroyli tabrik.
          </p>

          <div className={`mt-8 w-full rounded-3xl bg-white p-6 text-left sm:p-8 ${config.shadowClass}`}>
            <label className="block text-xs font-semibold tracking-wide text-rose">
              {config.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={config.namePlaceholder}
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
          <h1 className="font-display text-3xl text-ink">Sehrli tabrik kartasi</h1>
          <div className={`mt-8 w-full rounded-3xl bg-white p-6 sm:p-8 ${config.shadowClass}`}>
            <p className="font-display text-xl italic text-rose">
              {config.salutation}, {name.trim() || "..."}! 🎂
            </p>
            <div className="my-4 flex justify-center text-4xl">🎁</div>
            <p className="whitespace-pre-line leading-relaxed text-ink/70">{message}</p>
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

          <div className={`relative mt-8 w-full max-w-xs rounded-3xl bg-white p-6 ${config.shadowClass}`}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cardAmber text-3xl">
              🎁
            </div>
            <p className="mt-4 font-medium text-ink">Siz uchun maxsus sovg'a bor!</p>
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
    </main>
  );
}
