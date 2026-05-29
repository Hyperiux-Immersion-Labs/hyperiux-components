import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Stripe sends the raw body — Next.js must not parse it before we verify the signature.
export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const obj = event.data.object;

  switch (event.type) {
    case "checkout.session.completed": {
      // Retrieve the full subscription object so we have period_end
      const subscription = await stripe.subscriptions.retrieve(obj.subscription);

      // Clerk user ID was stored in the customer metadata when we created the customer
      const customer = await stripe.customers.retrieve(obj.customer);
      const clerkUserId = customer.metadata?.clerk_user_id;

      if (!clerkUserId) {
        console.error("checkout.session.completed: no clerk_user_id in customer metadata", obj.customer);
        break;
      }

      await supabase.from("subscriptions").upsert(
        {
          clerk_user_id: clerkUserId,
          stripe_customer_id: obj.customer,
          stripe_subscription_id: subscription.id,
          plan: "pro",
          status: "active",
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_user_id" }
      );
      break;
    }

    case "customer.subscription.updated": {
      const isActive = obj.status === "active";

      await supabase
        .from("subscriptions")
        .update({
          plan: isActive ? "pro" : "free",
          status: isActive ? "active" : "inactive",
          current_period_end: new Date(obj.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", obj.id);
      break;
    }

    case "customer.subscription.deleted": {
      // Subscription canceled — revoke pro access immediately
      await supabase
        .from("subscriptions")
        .update({
          plan: "free",
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", obj.id);
      break;
    }

    case "invoice.payment_failed": {
      // Mark as inactive so access is blocked until payment succeeds
      await supabase
        .from("subscriptions")
        .update({ status: "inactive", updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", obj.subscription);
      break;
    }

    case "invoice.paid": {
      // Renewing subscription — refresh period end and ensure status is active
      const sub = await stripe.subscriptions.retrieve(obj.subscription);
      await supabase
        .from("subscriptions")
        .update({
          plan: "pro",
          status: "active",
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", obj.subscription);
      break;
    }

    default:
      // Unhandled event type — ignore safely
      break;
  }

  return NextResponse.json({ received: true });
}
