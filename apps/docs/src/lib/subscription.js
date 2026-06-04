import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

const ACTIVE_STATUSES = ["active", "trialing"];

export async function getUserPlan(userId) {
  if (!userId) {
    return "free";
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan,status,current_period_end")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("GET_USER_PLAN_SUPABASE_ERROR:", error);
  }

  if (data?.plan === "pro" && ACTIVE_STATUSES.includes(data.status)) {
    if (!data.current_period_end) {
      return "pro";
    }

    const periodEnd = new Date(data.current_period_end).getTime();

    if (Number.isNaN(periodEnd) || periodEnd > Date.now()) {
      return "pro";
    }
  }

  const user = await currentUser();

  if (
    user?.publicMetadata?.plan === "pro" ||
    user?.publicMetadata?.proAccess === true
  ) {
    return "pro";
  }

  return "free";
}

export function canAccessEffect(effectTier = "free", userPlan = "free") {
  if (!effectTier || effectTier === "free") {
    return true;
  }

  return userPlan === "pro";
}