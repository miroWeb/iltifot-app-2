"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import {
  RECIPIENTS,
  THEMES,
  RECIPIENT_DEFAULT_COLOR,
  GRADIENT,
  PREVIEW_LINE,
  type RecipientId,
  type ThemeId,
  type ColorId,
} from "@/lib/content";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

export default function CreateForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState<RecipientId>("sevgilim");
  const [theme, setTheme] = useState<ThemeId>("uzr");
  const [color, setColor] = useState<ColorId>("coral");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableThemes = THEMES.filter(
    (t) => !("onlyFor" in t) || t.onlyFor === recipient
  );

  function applyRecipient(r: RecipientId) {
    setRecipient(r);
    setColor(RECIPIENT_DEFAULT_COLOR[r]);
    const stillValid = THEMES.some(
      (t) => t.id === theme && (!("onlyFor" in t) || t.onlyFor === r)
    );
    if (!stillValid) setTheme("shunchaki");
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kimga = params.get("kimga");
    if (kimga && RECIPIENTS.some((r) => r.id === kimga)) {
      applyRecipient(kimga as RecipientId);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Avval ismini yozing");
      return;
    }
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
        const { data } = supabase.storage
          .from("page-images")
          .getPublicUrl(path);
        image_url = data.publicUrl;
      }

      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_name: name.trim(),
          recipient,
          theme,
          color,
          image_url,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Nimadir xato ketdi");
        return;
      }
      router.push(`/s/${data.slug}`);
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="hero-form" className="scroll-mt-6 bg-blush/60 py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mt-3 max-w-md text-ink/70">
            Kimga va nima uchun ekanini tanlang — sahifa bir necha soniyada
            tayyor bo'ladi.
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-8 max-w-md">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Uning ismi"
              className="focus-ring w-full rounded-2xl border border-ink/15 bg-white px-5 py-3.5 text-ink placeholder:text-ink/40"
            />

            <p className="mt-4 text-sm text-ink/60">Kimga:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {RECIPIENTS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => applyRecipient(r.id)}
                  className={`focus-ring rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    recipient === r.id
                      ? "border-rose bg-rose text-white"
                      : "border-ink/15 bg-white text-ink/70 hover:border-rose/40"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm text-ink/60">Nima uchun:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableThemes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`focus-ring rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    theme === t.id
                      ? "border-ink bg-ink text-white"
                      : "border-ink/15 bg-white text-ink/70 hover:border-ink/30"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {!imagePreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="focus-ring rounded-2xl border border-dashed border-ink/25 bg-white px-4 py-2.5 text-sm text-ink/60 hover:border-rose/40 hover:text-ink"
                >
                  + Rasm qo'shish (ixtiyoriy)
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
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
            </div>

            {error && <p className="mt-3 text-sm text-rose">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring mt-5 w-full rounded-full bg-rose px-6 py-3.5 font-medium text-white transition-colors hover:bg-rose2 disabled:opacity-60"
            >
              {loading ? "Yaratilmoqda\u2026" : "Sahifa yaratish"}
            </button>
          </form>
          <p className="mt-3 text-sm text-ink/50">
            Bepul boshlanadi. Karta raqami shart emas.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] rotate-[3deg]">
          <div className="rounded-[28px] border border-ink/10 bg-white p-3 shadow-[0_30px_60px_-20px_rgba(201,123,134,0.35)]">
            <div
              className={`overflow-hidden rounded-[20px] bg-gradient-to-b px-5 py-9 text-center transition-colors ${GRADIENT[color]}`}
            >
              <p className="font-display text-sm italic text-cream/80">
                {name.trim() ? `${name.trim()}ga atalgan` : "Ismini yozing"}
              </p>
              <p className="mt-3 font-display text-2xl text-cream">
                {PREVIEW_LINE[theme]}
              </p>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt=""
                  className="mx-auto mt-6 h-24 w-24 rounded-full object-cover ring-2 ring-cream/40"
                />
              ) : (
                <div className="mx-auto mt-6 h-24 w-24 rounded-full bg-cream/15" />
              )}
              <p className="mt-6 text-xs text-cream/70">havolani bosib oching</p>
            </div>
          </div>
          <div className="absolute -right-6 -top-6 -z-10 h-full w-full rotate-[-6deg] rounded-[28px] bg-rose/20" />
        </div>
      </div>
    </section>
  );
}
