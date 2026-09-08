import { supabaseBrowser } from "@/lib/supabase";
import { THEME_COPY, GRADIENT, type ThemeId, type ColorId } from "@/lib/content";
import { notFound } from "next/navigation";

async function getPage(slug: string) {
  const supabase = supabaseBrowser();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export default async function SurprisePage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  const isExpired =
    page.expires_at && new Date(page.expires_at).getTime() < Date.now();

  if (isExpired) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
        <div>
          <p className="font-display text-3xl text-ink">
            Bu sahifaning muddati tugagan
          </p>
          <p className="mt-3 text-ink/60">
            Bepul sahifalar 24 soat amal qiladi. Yangisini yarating yoki
            premium bilan umrbod saqlang.
          </p>
          <a
            href="/"
            className="focus-ring mt-6 inline-block rounded-full bg-wine px-6 py-3 text-cream"
          >
            Yangi sahifa yaratish
          </a>
        </div>
      </main>
    );
  }

  const copy = THEME_COPY[page.theme as ThemeId] ?? THEME_COPY.shunchaki;
  const gradient = GRADIENT[page.color as ColorId] ?? GRADIENT.coral;

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-br ${gradient} px-6 text-center`}
    >
      <p className="font-display text-sm italic text-cream/70">
        {page.recipient_name}ga {copy.eyebrow}
      </p>
      <h1 className="mt-4 max-w-lg font-display text-3xl leading-tight text-cream md:text-5xl">
        {copy.line1}
        <br />
        {copy.line2}
      </h1>
      {page.message && (
        <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/90">
          {page.message}
        </p>
      )}
      {page.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={page.image_url}
          alt=""
          className="mt-10 h-32 w-32 rounded-full object-cover ring-4 ring-cream/30"
        />
      ) : (
        <div className="mt-10 flex h-28 w-28 items-center justify-center rounded-full bg-cream/15">
          <div className="h-16 w-16 rounded-full bg-cream/30" />
        </div>
      )}
      <p className="mt-10 text-xs text-cream/50">Iltifot orqali yuborildi</p>
    </main>
  );
}
