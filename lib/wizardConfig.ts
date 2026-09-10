import type { RecipientId } from "./content";
import type { IconName } from "@/components/wizard/effects";

export type WizardThemeId = "shunchaki" | "minnatdorchilik" | "tugilgan_kun";

export type WizardThemeConfig = {
  id: WizardThemeId;
  label: string;
  icon: IconName;
  desc: string;
};

export type RecipientWizardConfig = {
  recipient: RecipientId;
  eyebrow: string;
  heading: string;
  subtext: string;
  salutation: string;
  nameLabel: string;
  namePlaceholder: string;
  bgGradient: string;
  cardBg: string;
  shadowClass: string;
  themes: WizardThemeConfig[];
};

function shunchaki(desc: string, icon: IconName = "smile"): WizardThemeConfig {
  return { id: "shunchaki", label: "Shunchaki", icon, desc };
}

function minnatdorchilik(desc: string): WizardThemeConfig {
  return { id: "minnatdorchilik", label: "Minnatdorchilik", icon: "flower", desc };
}

function tugilganKun(desc: string): WizardThemeConfig {
  return { id: "tugilgan_kun", label: "Tug'ilgan kun", icon: "cake", desc };
}

export const RECIPIENT_WIZARDS: Partial<
  Record<RecipientId, RecipientWizardConfig>
> = {
  dost: {
    recipient: "dost",
    eyebrow: "DO'STIM UCHUN",
    heading: "Do'stingizni kuldirib qo'ying 😄",
    subtext: "Yaqin do'stingiz uchun mos mavzuni tanlang — u albatta xursand bo'ladi.",
    salutation: "Do'stim",
    nameLabel: "DO'STINGIZNING ISMI",
    namePlaceholder: "Masalan: Jasur",
    bgGradient: "from-cardAmber/40 via-cream to-cardAmber/20",
    cardBg: "bg-cardAmber",
    shadowClass: "shadow-[0_30px_60px_-25px_rgba(201,160,80,0.4)]",
    themes: [
      shunchaki("Yaqin do'stingizga hech qanday sababsiz iliq bir tabassum ulashish uchun."),
      tugilganKun("Yaqin do'stingizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring."),
    ],
  },
  ona: {
    recipient: "ona",
    eyebrow: "ONAM UCHUN",
    heading: "Onangizga iliq bir xabar tayyorlang 🌷",
    subtext: "Onangiz uchun mos mavzuni tanlang — u albatta ko'ngli to'lib ketadi.",
    salutation: "Onajonim",
    nameLabel: "ONANGIZNING ISMI",
    namePlaceholder: "Masalan: Dilnoza",
    bgGradient: "from-cardPink/50 via-cream to-cardPink/20",
    cardBg: "bg-cardPink",
    shadowClass: "shadow-[0_30px_60px_-25px_rgba(201,123,150,0.35)]",
    themes: [
      shunchaki("Onangizga hech qanday sababsiz mehr-oqibat bildirish uchun.", "heart"),
      minnatdorchilik("Onangizning mehnati va sabri uchun chin dildan rahmat aytish maktubi."),
      tugilganKun("Onangizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring."),
    ],
  },
  ota: {
    recipient: "ota",
    eyebrow: "DADAM UCHUN",
    heading: "Dadangizga iliq bir xabar tayyorlang 💙",
    subtext: "Dadangiz uchun mos mavzuni tanlang — u albatta ta'sirlanadi.",
    salutation: "Dadajonim",
    nameLabel: "DADANGIZNING ISMI",
    namePlaceholder: "Masalan: Sardor",
    bgGradient: "from-cardBlue/50 via-cream to-cardBlue/20",
    cardBg: "bg-cardBlue",
    shadowClass: "shadow-[0_30px_60px_-25px_rgba(92,122,154,0.35)]",
    themes: [
      shunchaki("Dadangizga hech qanday sababsiz mehr-oqibat bildirish uchun.", "heart"),
      minnatdorchilik("Dadangizning mehnati va tayanchi uchun chin dildan rahmat aytish maktubi."),
      tugilganKun("Dadangizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring."),
    ],
  },
  aka: {
    recipient: "aka",
    eyebrow: "AKAM UCHUN",
    heading: "Akangizni kuldirib qo'ying 😄",
    subtext: "Akangiz uchun mos mavzuni tanlang — u albatta xursand bo'ladi.",
    salutation: "Akajonim",
    nameLabel: "AKANGIZNING ISMI",
    namePlaceholder: "Masalan: Bekzod",
    bgGradient: "from-cardGreen/50 via-cream to-cardGreen/20",
    cardBg: "bg-cardGreen",
    shadowClass: "shadow-[0_30px_60px_-25px_rgba(110,146,104,0.35)]",
    themes: [
      shunchaki("Akangizga hech qanday sababsiz iliq bir tabassum ulashish uchun."),
      tugilganKun("Akangizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring."),
    ],
  },
  opa: {
    recipient: "opa",
    eyebrow: "OPAM UCHUN",
    heading: "Opangizga iliq bir xabar tayyorlang 💜",
    subtext: "Opangiz uchun mos mavzuni tanlang — u albatta xursand bo'ladi.",
    salutation: "Opajonim",
    nameLabel: "OPANGIZNING ISMI",
    namePlaceholder: "Masalan: Nilufar",
    bgGradient: "from-cardPurple/50 via-cream to-cardPurple/20",
    cardBg: "bg-cardPurple",
    shadowClass: "shadow-[0_30px_60px_-25px_rgba(150,120,190,0.35)]",
    themes: [
      shunchaki("Opangizga hech qanday sababsiz iliq bir tabassum ulashish uchun."),
      tugilganKun("Opangizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring."),
    ],
  },
  uka: {
    recipient: "uka",
    eyebrow: "UKAM UCHUN",
    heading: "Ukangizni kuldirib qo'ying 😄",
    subtext: "Ukangiz uchun mos mavzuni tanlang — u albatta xursand bo'ladi.",
    salutation: "Ukajonim",
    nameLabel: "UKANGIZNING ISMI",
    namePlaceholder: "Masalan: Sanjar",
    bgGradient: "from-cardTeal/50 via-cream to-cardTeal/20",
    cardBg: "bg-cardTeal",
    shadowClass: "shadow-[0_30px_60px_-25px_rgba(79,156,140,0.35)]",
    themes: [
      shunchaki("Ukangizga hech qanday sababsiz iliq bir tabassum ulashish uchun."),
      tugilganKun("Ukangizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring."),
    ],
  },
  singil: {
    recipient: "singil",
    eyebrow: "SINGLIM UCHUN",
    heading: "Singlingizni kuldirib qo'ying 😄",
    subtext: "Singlingiz uchun mos mavzuni tanlang — u albatta xursand bo'ladi.",
    salutation: "Singlim",
    nameLabel: "SINGLINGIZNING ISMI",
    namePlaceholder: "Masalan: Madina",
    bgGradient: "from-cardPeach/50 via-cream to-cardPeach/20",
    cardBg: "bg-cardPeach",
    shadowClass: "shadow-[0_30px_60px_-25px_rgba(201,123,134,0.35)]",
    themes: [
      shunchaki("Singlingizga hech qanday sababsiz iliq bir tabassum ulashish uchun."),
      tugilganKun("Singlingizning eng muhim kunida eng iliq istaklar va sovg'alar yuboring."),
    ],
  },
};
