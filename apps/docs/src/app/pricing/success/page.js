import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncProAccessFromCheckoutSession } from "@/lib/pro-access";

export const dynamic = "force-dynamic";

export default async function PricingSuccessPage({ searchParams }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const sessionId = params?.session_id;

  if (!sessionId) {
    redirect("/pricing?upgrade=missing-session");
  }

  try {
    await syncProAccessFromCheckoutSession(sessionId, userId);
  } catch (error) {
    console.error("PRICING_SUCCESS_SYNC_ERROR:", error);

    redirect(
      `/pricing?upgrade=sync-failed&reason=${encodeURIComponent(
        error?.message || "unknown"
      )}`
    );
  }

  redirect("/effects?upgraded=true");
}