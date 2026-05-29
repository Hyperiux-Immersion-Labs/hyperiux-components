import { supabase } from "./supabase";

/**
 * Returns the user's current plan: "pro" | "free".
 * Called server-side only (Server Components, API routes).
 *
 * A user is considered "pro" only when:
 *   - A row exists for their Clerk user ID
 *   - status === "active"
 *   - current_period_end is in the future
 */
export async function getUserPlan(clerkUserId) {
  if (!clerkUserId) return "free";

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error || !data) return "free";
  if (data.status !== "active") return "free";
  if (data.current_period_end && new Date(data.current_period_end) < new Date()) return "free";

  return data.plan === "pro" ? "pro" : "free";
}

/**
 * Returns true if the given effect tier is accessible to the user's plan.
 * Free effects are always accessible. Pro effects require a pro plan.
 */
export function canAccessEffect(effectTier, userPlan) {
  if (effectTier === "free") return true;
  return userPlan === "pro";
}
