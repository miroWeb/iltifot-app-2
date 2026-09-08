const steps = [
  {
    n: "01",
    title: "Kimga?",
    text: "Yaqiningizni tanlang — sevgilim, onam, do'stim yoki boshqa.",
  },
  {
    n: "02",
    title: "Nima uchun?",
    text: "Sababni belgilang — tug'ilgan kun, shunchaki, kechirim yoki uchrashuv.",
  },
  {
    n: "03",
    title: "Yuboring!",
    text: "Maxsus animatsiya va virtual sovg'alarni havola orqali lahzada ulashing.",
  },
];

export default function HowItWorks() {
  return (
    <section id="qanday-ishlaydi" className="bg-blush/40 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="inline-block rounded-full bg-rose/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-rose">
          ODDIY VA TEZ
        </span>
        <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
          Bu qanday ishlaydi?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          Atigi 3 ta oddiy qadamda yaqinlaringiz yuziga tabassum hadya eting.
        </p>

        <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl bg-white p-7">
              <span className="font-display text-3xl italic text-rose">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
