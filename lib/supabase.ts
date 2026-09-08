import { createClient } from "@supabase/supabase-js";

// Browser/client tomonida ishlatiladi (public, o'qish uchun yetarli).
export function supabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Faqat server (API route) tomonida ishlatiladi — yozish huquqiga ega.
// SUPABASE_SERVICE_ROLE_KEY hech qachon brauzerga chiqmasligi kerak.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type Theme = "uzr" | "taklif" | "tugilgan_kun" | "shunchaki";
export type Plan = "free" | "premium";

export interface PageRecord {
  id: string;
  slug: string;
  recipient_name: string;
  theme: Theme;
  color: string;
  message: string | null;
  image_url: string | null;
  plan: Plan;
  created_at: string;
  expires_at: string | null;
}
