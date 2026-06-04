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

  const [{ data: wishlist, error: wishlistError }, { data: subscription, error: subscriptionError }] =
    await Promise.all([
      supabase
        .from("wishlisted_effects")
        .select("*")
        .eq("clerk_user_id", userId),

      supabase
        .from("subscriptions")
        .select(
          "plan,status,billing_interval,current_period_end,stripe_subscription_id,stripe_price_id"
        )
        .eq("clerk_user_id", userId)
        .maybeSingle(),
    ]);

  if (wishlistError) {
    return NextResponse.json(
      { error: wishlistError.message },
      { status: 500 }
    );
  }

  if (subscriptionError) {
    return NextResponse.json(
      { error: subscriptionError.message },
      { status: 500 }
    );
  }

  const totalEffects = registry.items?.length || 0;
  const totalEffectsAccess =
    plan === "pro"
      ? totalEffects
      : Math.min(FREE_EFFECT_ACCESS_LIMIT, totalEffects);

  return NextResponse.json({
    savedCount: wishlist?.length || 0,
    savedEffects: wishlist || [],
    joinedAt: user?.createdAt || null,
    plan,
    totalEffects,
    totalEffectsAccess,

    subscriptionStatus: subscription?.status || "inactive",
    billingInterval: subscription?.billing_interval || null,
    planValidUntil: subscription?.current_period_end || null,
    stripeSubscriptionId: subscription?.stripe_subscription_id || null,
    stripePriceId: subscription?.stripe_price_id || null,
  });
}