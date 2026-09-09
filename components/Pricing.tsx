const freeFeatures = [
  "Asosiy dizayn andozalari",
  "Ism moslashtirish",
  "Standart matnlar",
  "Mehrim markasi (watermark)",
];

const premiumFeatures = [
  "Barcha HD vizual effektlar",
  "Cheksiz ranglar gammasi",
  "Maxsus interaktiv gullar",
  "Kechirim va shoshilinch xabarlar",
  "Hech qanday reklamalarsiz",
  "Mehrim markasini o'chirish",
];

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 h-4 w-4 shrink-0 text-rose"
    >
      <path
        d="M4 10.5L8 14.5L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="narxlar" className="bg-cream py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="inline-block rounded-full bg-rose/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-rose">
          NARXLAR
        </span>
        <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
          Sizga mos bo'lgan tarifni tanlang
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          Hissiyotlarni hisob-kitob qilmang, ammo premium effektlar bilan
          unutilmas tajriba yarating.
        </p>

        <div className="mt-12 grid gap-6 text-left sm:grid-cols-2">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
            <p className="font-display text-xl text-ink">Bepul</p>
            <p className="mt-1 text-sm text-ink/60">
              Do'stlar va oila a'zolari uchun oddiy tabriklar yuboring.
            </p>
            <p className="mt-6 font-display text-3xl text-ink">
              0 <span className="text-base font-sans text-ink/50">so'm</span>
            </p>
            <ul className="mt-6 space-y-3 border-t border-ink/10 pt-6">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink/70">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#kategoriyalar"
              className="focus-ring mt-8 block rounded-full border border-ink/15 py-3 text-center font-medium text-ink transition-colors hover:border-rose/40"
            >
              Hozir boshlash
            </a>
          </div>

          <div className="relative rounded-3xl border-2 border-rose bg-white p-6 sm:p-8">
            <span className="absolute right-6 top-6 rounded-full bg-rose/10 px-3 py-1 text-xs font-semibold text-rose">
              TAVSIYA ETILADI
            </span>
            <p className="font-display text-xl text-ink">Premium</p>
            <p className="mt-6 font-display text-3xl text-ink">
              15,000{" "}
              <span className="text-base font-sans text-ink/50">so'm</span>
            </p>
            <ul className="mt-6 space-y-3 border-t border-ink/10 pt-6">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink/70">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#kategoriyalar"
              className="focus-ring mt-8 block rounded-full bg-rose py-3 text-center font-medium text-white transition-colors hover:bg-rose2"
            >
              Premiumga o'tish
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
