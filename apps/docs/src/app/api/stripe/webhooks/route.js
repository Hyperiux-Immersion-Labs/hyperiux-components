import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  markUserFree,
  markUserProFromSubscription,
} from "@/lib/pro-access";

export const dynamic = "force-dynamic";

async function getClerkUserIdFromCustomer(customerId) {
  const customer = await stripe.customers.retrieve(customerId);

  if (!customer || customer.deleted) return null;

  return customer.metadata?.clerk_user_id || null;
}

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("STRIPE_WEBHOOK_SIGNATURE_ERROR:", error.message);

    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  try {
    const obj = event.data.object;

    console.log("STRIPE_WEBHOOK_EVENT:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = obj;

        if (!session.subscription) {
          console.error("No subscription on checkout session:", session.id);
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        const clerkUserId =
          session.metadata?.clerk_user_id ||
          subscription.metadata?.clerk_user_id ||
          (await getClerkUserIdFromCustomer(session.customer));

        if (!clerkUserId) {
          console.error("Missing clerk_user_id for session:", session.id);
          break;
        }

        const billingInterval =
          session.metadata?.billing_interval ||
          subscription.metadata?.billing_interval ||
          null;

        await markUserProFromSubscription({
          clerkUserId,
          stripeCustomerId: session.customer,
          subscription,
          billingInterval,
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = obj;

        const clerkUserId =
          subscription.metadata?.clerk_user_id ||
          (await getClerkUserIdFromCustomer(subscription.customer));

        if (!clerkUserId) {
          console.error("Missing clerk_user_id for subscription:", subscription.id);
          break;
        }

        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        if (!isActive) {
          await markUserFree({
            clerkUserId,
            status: subscription.status,
          });
          break;
        }

        await markUserProFromSubscription({
          clerkUserId,
          stripeCustomerId: subscription.customer,
          subscription,
          billingInterval: subscription.metadata?.billing_interval || null,
        });

        break;
      }

      case "invoice.paid": {
        const invoice = obj;

        if (!invoice.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription
        );

        const clerkUserId =
          subscription.metadata?.clerk_user_id ||
          (await getClerkUserIdFromCustomer(subscription.customer));

        if (!clerkUserId) break;

        await markUserProFromSubscription({
          clerkUserId,
          stripeCustomerId: subscription.customer,
          subscription,
          billingInterval: subscription.metadata?.billing_interval || null,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = obj;

        const clerkUserId =
          subscription.metadata?.clerk_user_id ||
          (await getClerkUserIdFromCustomer(subscription.customer));

        if (!clerkUserId) break;

        await markUserFree({
          clerkUserId,
          status: "canceled",
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = obj;

        if (!invoice.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription
        );

        const clerkUserId =
          subscription.metadata?.clerk_user_id ||
          (await getClerkUserIdFromCustomer(subscription.customer));

        if (!clerkUserId) break;

        await markUserFree({
          clerkUserId,
          status: "inactive",
        });

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("STRIPE_WEBHOOK_HANDLER_ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Webhook failed" },
      { status: 500 }
    );
  }
}