import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

const PRICE_IDS = {
  monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  quarterly: process.env.STRIPE_PRO_QUARTERLY_PRICE_ID,
  yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
};

function getBillingInterval(value) {
  if (["monthly", "quarterly", "yearly"].includes(value)) {
    return value;
  }

  return null;
}

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", redirectTo: "/sign-in" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const billingInterval = getBillingInterval(body.billingInterval);
    const priceId = PRICE_IDS[billingInterval];

    if (!billingInterval || !priceId) {
      return NextResponse.json(
        { error: "Invalid billing interval or missing Stripe price ID." },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    const { data: existing, error: lookupError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (lookupError) {
      console.error("SUPABASE_LOOKUP_ERROR:", lookupError);

      return NextResponse.json(
        { error: "Unable to check subscription record." },
        { status: 500 }
      );
    }

    let customerId = existing?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: user?.fullName || undefined,
        metadata: {
          clerk_user_id: userId,
        },
      });

      customerId = customer.id;

      const { error: upsertError } = await supabase
        .from("subscriptions")
        .upsert(
          {
            clerk_user_id: userId,
            stripe_customer_id: customerId,
            plan: "free",
            status: "inactive",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "clerk_user_id" }
        );

      if (upsertError) {
        console.error("SUPABASE_CUSTOMER_UPSERT_ERROR:", upsertError);

        return NextResponse.json(
          { error: "Unable to create subscription record." },
          { status: 500 }
        );
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      metadata: {
        clerk_user_id: userId,
        billing_interval: billingInterval,
        plan: "pro",
      },
      subscription_data: {
        metadata: {
          clerk_user_id: userId,
          billing_interval: billingInterval,
          plan: "pro",
        },
      },
      success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE_CHECKOUT_ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Unable to create checkout session." },
      { status: 500 }
    );
  }
}