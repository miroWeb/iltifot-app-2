export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, #F6D9DC, transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-4 md:grid-cols-2 md:gap-10 md:pt-10">
        <div>
          <span className="text-xs font-semibold tracking-wide text-rose">
            MEHRINGIZNI BILDIRING
          </span>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.1] text-ink md:text-[3.4rem]">
            Aytolmagan gapingizni,
            <br />
            <span className="text-rose">bitta sahifa</span> aytib
            <br />
            bersin.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            Sevganlaringizga maxsus tabriklar va sovg'alar yuboring. &ldquo;Iltifot&rdquo;
            orqali masofalar yaqinlashadi, qalblar birlashadi.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#kategoriyalar"
              className="focus-ring rounded-full bg-rose px-7 py-3.5 font-medium text-white transition-colors hover:bg-rose2"
            >
              Boshlash
            </a>
            <a
              href="#qanday-ishlaydi"
              className="focus-ring rounded-full border border-ink/15 px-7 py-3.5 font-medium text-ink/80 transition-colors hover:border-rose/40 hover:text-ink"
            >
              Qanday ishlaydi?
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-cardRose via-cardPink to-cardPeach shadow-[0_40px_70px_-30px_rgba(201,123,134,0.45)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Frame.png"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 -z-10 h-full w-full rounded-[28px] bg-rose/15" />
        </div>
      </div>
    </section>
  );
}
