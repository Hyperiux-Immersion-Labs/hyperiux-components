import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  // Look up existing Stripe customer ID for this Clerk user
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("clerk_user_id", userId)
    .single();

  let customerId = existing?.stripe_customer_id;

  if (!customerId) {
    // Create a new Stripe customer and persist the ID immediately
    const customer = await stripe.customers.create({
      email,
      metadata: { clerk_user_id: userId },
    });
    customerId = customer.id;

    await supabase.from("subscriptions").upsert(
      { clerk_user_id: userId, stripe_customer_id: customerId, plan: "free", status: "inactive" },
      { onConflict: "clerk_user_id" }
    );
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      { price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 },
    ],
    // Allow users to apply promo codes at checkout
    allow_promotion_codes: true,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/effects?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/effects`,
  });

  return NextResponse.json({ url: session.url });
}
