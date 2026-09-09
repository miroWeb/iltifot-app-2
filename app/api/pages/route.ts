import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateSlug } from "@/lib/slug";

const VALID_THEMES = [
  "uzr",
  "taklif",
  "tugilgan_kun",
  "minnatdorchilik",
  "sevgi_izhori",
  "shunchaki",
];
const VALID_RECIPIENTS = [
  "sevgilim",
  "ona",
  "ota",
  "aka",
  "opa",
  "uka",
  "singil",
  "dost",
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recipient_name, recipient, theme, color, message, image_url } = body;

  if (!recipient_name || typeof recipient_name !== "string") {
    return NextResponse.json(
      { error: "Ism kiritilishi shart" },
      { status: 400 }
    );
  }
  if (!VALID_THEMES.includes(theme)) {
    return NextResponse.json({ error: "Noto'g'ri mavzu" }, { status: 400 });
  }
  if (!VALID_RECIPIENTS.includes(recipient)) {
    return NextResponse.json(
      { error: "Noto'g'ri qabul qiluvchi turi" },
      { status: 400 }
    );
  }
  // "Taklif qilish" va "Sevgi izhori" mavzulari faqat "sevgilim" uchun mantiqiy.
  if ((theme === "taklif" || theme === "sevgi_izhori") && recipient !== "sevgilim") {
    return NextResponse.json(
      { error: "Bu mavzu faqat sevgilim uchun mavjud" },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();
  const slug = generateSlug();

  // Bepul tarif: 24 soatdan keyin tugaydi. To'lov tizimi ulanganda
  // premium sahifalar uchun expires_at = null qilib qo'yiladi.
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("pages").insert({
    slug,
    recipient_name: recipient_name.slice(0, 60),
    recipient,
    theme,
    color: color ?? "coral",
    message: message ? String(message).slice(0, 400) : null,
    image_url: typeof image_url === "string" ? image_url : null,
    plan: "free",
    expires_at: expiresAt,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slug });
}
