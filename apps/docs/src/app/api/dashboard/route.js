import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { getRegistryIndex } from "@/lib/registry";
import { getUserPlan } from "@/lib/subscription";

const FREE_EFFECT_ACCESS_LIMIT = 30;

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const [user, plan, registry] = await Promise.all([
    currentUser(),
    getUserPlan(userId),
    Promise.resolve(getRegistryIndex()),
  ]);

  const { data: wishlist, error } = await supabase
    .from("wishlisted_effects")
    .select("*")
    .eq("clerk_user_id", userId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const totalEffects = registry.items?.length || 0;
  const totalEffectsAccess =
    plan === "pro" ? totalEffects : Math.min(FREE_EFFECT_ACCESS_LIMIT, totalEffects);

  return NextResponse.json({
    savedCount: wishlist.length,
    savedEffects: wishlist,
    joinedAt: user?.createdAt || null,
    plan,
    totalEffects,
    totalEffectsAccess,
  });
}
