import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const VALID_RESPONSES = ["yes", "thinking", "accept", "later", "forgiven"];

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const body = await req.json();
  const { response } = body;

  if (!VALID_RESPONSES.includes(response)) {
    return NextResponse.json({ error: "Noto'g'ri javob" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  // Faqat birinchi javob "qulflanadi" — keyingi urinishlar shu javobga
  // ta'sir qilmaydi, har doim birinchi qabul qilingan javob qaytariladi.
  const { data: updated, error: updateError } = await supabase
    .from("pages")
    .update({ response, responded_at: new Date().toISOString() })
    .eq("slug", params.slug)
    .is("response", null)
    .select("response, responded_at");

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (updated && updated.length > 0) {
    return NextResponse.json(updated[0]);
  }

  const { data: existing, error: fetchError } = await supabase
    .from("pages")
    .select("response, responded_at")
    .eq("slug", params.slug)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Sahifa topilmadi" }, { status: 404 });
  }

  return NextResponse.json(existing);
}
