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
  { id: "shunchaki", label: "Shunchaki" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

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
  shunchaki: {
    eyebrow: "sababsiz",
    line1: "Shunchaki bilib qo'y —",
    line2: "sen menga muhimsan.",
  },
};
