import { supabaseBrowser, type PageRecord } from "@/lib/supabase";
import { notFound } from "next/navigation";
import RevealExperience from "@/components/reveal/RevealExperience";

async function getPage(slug: string): Promise<PageRecord | null> {
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

  return <RevealExperience page={page} />;
}
