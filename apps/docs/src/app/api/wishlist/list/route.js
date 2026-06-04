import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json([]);
  }

  const { data } = await supabase
    .from("wishlisted_effects")
    .select("effect_slug")
    .eq("clerk_user_id", userId);

  return NextResponse.json(data || []);
}