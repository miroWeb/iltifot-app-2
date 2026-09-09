import { RECIPIENTS, CARD_BG, RecipientId } from "@/lib/content";

const CARD_IMAGE: Record<RecipientId, string> = {
  sevgilim: "/sevgilim.png",
  ona: "/ona.png",
  ota: "/dada.png",
  aka: "/aka.png",
  dost: "/dos.png",
  opa: "/opa.png",
  uka: "/uka.png",
  singil: "/s2.jpeg",
};

function CardArt({ id }: { id: RecipientId }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={CARD_IMAGE[id]}
      alt=""
      className="h-full w-full object-cover"
    />
  );
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
              href={r.id === "sevgilim" ? "/sevgilim" : "/"}
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
