"use client";

import { useState } from "react";

export default function ShareResult({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/s/${slug}`
      : `/s/${slug}`;
  const shareText = `${name.trim() || "Senga"} uchun maxsus sahifa tayyorladim 💌`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard ruxsat bermasa ham, foydalanuvchi havolani qo'lda nusxalay oladi
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Iltifot", text: shareText, url });
      } catch {
        // foydalanuvchi ulashishni bekor qilgan bo'lishi mumkin — hech narsa qilmaymiz
      }
    } else {
      copyLink();
    }
  }

  function shareToTelegram() {
    const href = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blush via-cream to-cardBlue/40 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)] sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose/10 text-3xl">
          🎉
        </div>
        <h1 className="mt-4 font-display text-2xl text-ink">
          Havolangiz tayyor!
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          {name.trim() || "Yaqiningiz"} uchun maxsus sahifa yaratildi. Havolani
          ulashing — ular ochganda bu tabrikni his qilishadi.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-ink/15 bg-cream/40 px-4 py-3">
          <span className="flex-1 truncate text-left text-sm text-ink/70">
            {url}
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="focus-ring shrink-0 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-ink/85"
          >
            {copied ? "Nusxalandi ✓" : "Nusxalash"}
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            onClick={nativeShare}
            className="focus-ring w-full rounded-full bg-rose py-3 font-medium text-white transition-colors hover:bg-rose2"
          >
            📤 Ulashish
          </button>
          <button
            type="button"
            onClick={shareToTelegram}
            className="focus-ring w-full rounded-full border border-ink/15 py-3 font-medium text-ink transition-colors hover:border-rose/40"
          >
            Telegram orqali yuborish
          </button>
        </div>

        <p className="mt-4 text-xs text-ink/40">
          Instagram'da yuborish uchun havolani nusxalab, xabar (DM) ichiga
          joylashtiring.
        </p>

        <a
          href="/"
          className="focus-ring mt-6 inline-block text-sm text-ink/50 underline underline-offset-2 hover:text-ink"
        >
          Bosh sahifaga qaytish
        </a>
      </div>
    </main>
  );
}
