export const RECIPIENTS = [
  { id: "sevgilim", label: "Sevgilim" },
  { id: "ona", label: "Onam" },
  { id: "ota", label: "Dadam" },
  { id: "aka", label: "Akam" },
  { id: "dost", label: "Do'stim" },
  { id: "opa", label: "Opam" },
  { id: "uka", label: "Ukam" },
  { id: "singil", label: "Singlim" },
] as const;

export type RecipientId = (typeof RECIPIENTS)[number]["id"];

// Kategoriyalar galereyasidagi har bir kartochkaning fon rangi.
export const CARD_BG: Record<RecipientId, string> = {
  sevgilim: "bg-cardRose",
  ona: "bg-cardPink",
  ota: "bg-cardBlue",
  aka: "bg-cardGreen",
  dost: "bg-cardAmber",
  opa: "bg-cardPurple",
  uka: "bg-cardTeal",
  singil: "bg-cardPeach",
};

export const THEMES = [
  { id: "uzr", label: "Uzr so'rash" },
  { id: "tugilgan_kun", label: "Tug'ilgan kun" },
  { id: "minnatdorchilik", label: "Minnatdorchilik" },
  { id: "taklif", label: "Taklif qilish", onlyFor: "sevgilim" },
  { id: "sevgi_izhori", label: "Sevgi izhori", onlyFor: "sevgilim" },
  { id: "shunchaki", label: "Shunchaki" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

// "Sevgilim" uchun mavzu tanlash qadamida ko'rsatiladigan kartalar
// (tartib va matnlar Figma dizayniga mos).
export const SEVGILIM_THEMES: {
  id: ThemeId;
  label: string;
  icon: "heart" | "spark" | "heartFilled" | "star" | "cake" | "smile" | "flower";
  desc: string;
}[] = [
  {
    id: "shunchaki",
    label: "Shunchaki",
    icon: "heart",
    desc: "Siz uchun qadrli bo'lgan insonga hech qanday sababsiz mehr ulashish uchun.",
  },
  {
    id: "uzr",
    label: "Uzr so'rash",
    icon: "spark",
    desc: "Ginalarni unutib, samimiy uzr so'rash va munosabatlarni tiklash maktubi.",
  },
  {
    id: "sevgi_izhori",
    label: "Sevgi izhori",
    icon: "heartFilled",
    desc: "Yurak tubidagi eng go'zal va sirli tuyg'ularni bir sahifaga jamlash maktubi.",
  },
  {
    id: "taklif",
    label: "Taklif qilish",
    icon: "star",
    desc: "Uchrashuvga, kechki ovqatga yoki shunchaki birga sayr qilishga taklifnoma.",
  },
  {
    id: "tugilgan_kun",
    label: "Tug'ilgan kun",
    icon: "cake",
    desc: "Yaqiningizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring.",
  },
];

// "Do'stim" uchun mavzu tanlash qadamida ko'rsatiladigan kartalar —
// hozircha faqat ikkitasi tayyor. Belgilar do'stlikka mos (romantik emas).
export const DOSTIM_THEMES: typeof SEVGILIM_THEMES = [
  {
    id: "shunchaki",
    label: "Shunchaki",
    icon: "smile",
    desc: "Yaqin do'stingizga hech qanday sababsiz iliq bir tabassum ulashish uchun.",
  },
  {
    id: "tugilgan_kun",
    label: "Tug'ilgan kun",
    icon: "cake",
    desc: "Yaqin do'stingizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring.",
  },
];

// "Onam" uchun mavzu tanlash qadamida ko'rsatiladigan kartalar.
export const ONA_THEMES: typeof SEVGILIM_THEMES = [
  {
    id: "shunchaki",
    label: "Shunchaki",
    icon: "heart",
    desc: "Onangizga hech qanday sababsiz mehr-oqibat bildirish uchun.",
  },
  {
    id: "minnatdorchilik",
    label: "Minnatdorchilik",
    icon: "flower",
    desc: "Onangizning mehnati va sabri uchun chin dildan rahmat aytish maktubi.",
  },
  {
    id: "tugilgan_kun",
    label: "Tug'ilgan kun",
    icon: "cake",
    desc: "Onangizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring.",
  },
];

// Xat yozish qadamida matn maydoniga oldindan yoziladigan andoza matn
// (foydalanuvchi buni tahrirlashi yoki o'chirib o'zinikini yozishi mumkin).
export const LETTER_TEMPLATES: Partial<Record<ThemeId, string>> = {
  shunchaki:
    "Bugun senga alohida sababsiz shunchaki mehr ulashgim keldi. Har doim yonimda bo'lganing uchun rahmat. Kichkina bu xabar katta minnatdorchiligimni anglatsin.",
  minnatdorchilik:
    "Sen uchun qilgan mehnating va cheksiz sabring uchun so'zlar kamlik qiladi. Meni katta qilib, doim yonimda bo'lganing uchun cheksiz rahmat. Seni juda-juda yaxshi ko'raman.",
  uzr:
    "Bilaman, so'zlarim yoki harakatlarim seni ranjitgan bo'lishi mumkin. Ginalarni unutib, samimiy qalbdan uzr so'rayman. Munosabatimiz men uchun juda qadrli.",
  sevgi_izhori:
    "Seni ilk ko'rganimda dunyo boshqacha tuyulgandek bo'ldi.\nHar bir lahzamiz eng yorqin nurdek go'zal edi.\nSenga bo'lgan samimiy muhabbatim va hurmatim cheksiz.\nMana shu bilan, seni hamisha sevaman...",
  taklif:
    "Seni maxsus bir kechga taklif qilmoqchiman. Birga vaqt o'tkazish, suhbatlashish va yangi xotiralar yaratish men uchun katta baxt bo'lardi.",
  tugilgan_kun:
    "Tug'ilgan kuningiz muborak bo'lsin! Ajoyib kun tilayman va har doim baxtli bo'lishingizni tilayman. Sizni juda qadrlayman.",
};

// "Uzr so'rash" oqimidagi 1-ekranda tanlanadigan sabab chiplari.
export const UZR_REASONS = [
  { id: "kech_qoldim", label: "Kech qoldim" },
  { id: "xafa_qildim", label: "Xafa qildim" },
  { id: "unutdim", label: "Unutdim" },
  { id: "boshqa", label: "Boshqa" },
] as const;

export type UzrReasonId = (typeof UZR_REASONS)[number]["id"];

// Sabab tanlanganda oyna ekraniga oldindan yoziladigan uzr matni.
export const UZR_REASON_TEMPLATES: Record<UzrReasonId, string> = {
  kech_qoldim:
    "Kechir meni, vaqtida kela olmadim. Bu bilan seni xafa qilganimni bilaman va juda afsusdaman.",
  xafa_qildim:
    "Kechir meni, so'zlarim yoki harakatlarim bilan seni xafa qildim. Bu men uchun ham og'ir, va buni tuzatishni juda xohlayman.",
  unutdim:
    "Kechir meni, muhim narsani unutib qo'ydim. Bu sening qadring pastligini anglatmaydi — men shunchaki xato qildim.",
  boshqa:
    "Kechir meni... Bilaman so'zlar yetarli emas, lekin qalbimdan chiqqan bu tabrik seni his-tuyg'ularimni anglatsin.",
};

// "Taklif qilish" oqimidagi 1-ekranda tanlanadigan joy chiplari.
export const TAKLIF_PLACES = [
  { id: "restoran", label: "Restoran", icon: "🍽️" },
  { id: "park", label: "Park", icon: "🌳" },
  { id: "kino", label: "Kino", icon: "🎬" },
  { id: "boshqa", label: "Boshqa", icon: "✨" },
] as const;

export type TaklifPlaceId = (typeof TAKLIF_PLACES)[number]["id"];

export const COLORS = [
  { id: "coral", swatch: "bg-coral" },
  { id: "wine", swatch: "bg-wine" },
  { id: "gold", swatch: "bg-gold" },
] as const;

export type ColorId = (typeof COLORS)[number]["id"];

// Har bir "kimga" tanlanganda avtomatik taklif qilinadigan rang.
export const RECIPIENT_DEFAULT_COLOR: Record<RecipientId, ColorId> = {
  sevgilim: "coral",
  ona: "gold",
  ota: "wine",
  aka: "wine",
  opa: "coral",
  uka: "gold",
  singil: "coral",
  dost: "gold",
};

export const GRADIENT: Record<ColorId, string> = {
  coral: "from-coral2 via-coral to-wine",
  wine: "from-wine2 to-ink",
  gold: "from-gold to-coral",
};

export const PREVIEW_LINE: Record<ThemeId, string> = {
  uzr: "Kechirasan, endi yo'l qo'ymayman",
  taklif: "Menga vaqt ajratasanmi?",
  tugilgan_kun: "Tug'ilgan kuning muborak!",
  minnatdorchilik: "Rahmat senga, borliging uchun",
  sevgi_izhori: "Yuragimdagi eng go'zal so'zlar senga",
  shunchaki: "Shunchaki bilib qo'y — muhimsan",
};

export const THEME_COPY: Record<
  ThemeId,
  { eyebrow: string; line1: string; line2: string }
> = {
  uzr: {
    eyebrow: "atalgan",
    line1: "Kechirasan,",
    line2: "buni his qilishing kerak edi.",
  },
  taklif: {
    eyebrow: "taklifnoma",
    line1: "Menga vaqt ajratasanmi?",
    line2: "Bir chashka choy bilan.",
  },
  tugilgan_kun: {
    eyebrow: "tabrik",
    line1: "Tug'ilgan kuning muborak!",
    line2: "Bugun senga atalgan kun.",
  },
  minnatdorchilik: {
    eyebrow: "minnatdorchilik",
    line1: "Rahmat senga,",
    line2: "borliging uchun shunchaki.",
  },
  sevgi_izhori: {
    eyebrow: "sevgi izhori",
    line1: "Yuragimdagi eng go'zal so'zlar",
    line2: "senga atalgan.",
  },
  shunchaki: {
    eyebrow: "sababsiz",
    line1: "Shunchaki bilib qo'y —",
    line2: "sen menga muhimsan.",
  },
};
