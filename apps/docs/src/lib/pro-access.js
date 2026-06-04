import "server-only";
import { clerkClient } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { createProPurchaseEmail } from "@/lib/emails/pro-purchase-email";

function getPeriodEnd(subscription) {
  const periodEnd =
    subscription?.current_period_end ||
    subscription?.items?.data?.[0]?.current_period_end ||
    null;

  return periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
}

async function getStripeCustomer(customerId) {
  if (!customerId) return null;

  const customer = await stripe.customers.retrieve(customerId);

  if (!customer || customer.deleted) return null;

  return customer;
}

export async function updateClerkUserToPro(clerkUserId, payload = {}) {
  if (!clerkUserId) {
    throw new Error("Missing Clerk user ID while updating Clerk metadata.");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);

  await client.users.updateUser(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      plan: "pro",
      proAccess: true,
      billingInterval: payload.billingInterval || null,
      stripeSubscriptionStatus: payload.status || "active",
      stripeSubscriptionId: payload.stripeSubscriptionId || null,
      stripePriceId: payload.stripePriceId || null,
      currentPeriodEnd: payload.currentPeriodEnd || null,
    },
  });
}

export async function updateClerkUserToFree(clerkUserId, status = "inactive") {
  if (!clerkUserId) {
    throw new Error("Missing Clerk user ID while downgrading Clerk metadata.");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);

  await client.users.updateUser(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      plan: "free",
      proAccess: false,
      billingInterval: null,
      stripeSubscriptionStatus: status,
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodEnd: null,
    },
  });
}

async function sendProAcknowledgementEmail({
  email,
  name,
  billingInterval,
  status,
  validUntil,
  stripeSubscriptionId,
}) {
  if (!email) return;

  const emailContent = createProPurchaseEmail({
    name,
    billingInterval,
    status,
    validUntil,
    stripeSubscriptionId,
  });

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Hyperiux Vault <onboarding@resend.dev>",
    to: email,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });
}

export async function markUserProFromSubscription({
  clerkUserId,
  stripeCustomerId,
  subscription,
  billingInterval,
}) {
  if (!clerkUserId) {
    throw new Error("Missing clerkUserId in markUserProFromSubscription.");
  }

  if (!subscription?.id) {
    throw new Error("Missing Stripe subscription in markUserProFromSubscription.");
  }

  const stripePriceId = subscription.items?.data?.[0]?.price?.id || null;
  const status = subscription.status || "active";
  const currentPeriodEnd = getPeriodEnd(subscription);
  const resolvedBillingInterval =
    billingInterval || subscription.metadata?.billing_interval || null;

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id,pro_ack_email_sent_at")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  const { error } = await supabase.from("subscriptions").upsert(
    {
      clerk_user_id: clerkUserId,
      stripe_customer_id: stripeCustomerId || subscription.customer,
      stripe_subscription_id: subscription.id,
      stripe_price_id: stripePriceId,
      billing_interval: resolvedBillingInterval,
      plan: "pro",
      status,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "clerk_user_id",
    }
  );

  if (error) {
    console.error("SUPABASE_MARK_PRO_ERROR:", error);
    throw error;
  }

  await updateClerkUserToPro(clerkUserId, {
    billingInterval: resolvedBillingInterval,
    status,
    stripeSubscriptionId: subscription.id,
    stripePriceId,
    currentPeriodEnd,
  });

  const shouldSendAcknowledgementEmail =
    !existingSubscription?.pro_ack_email_sent_at ||
    existingSubscription?.stripe_subscription_id !== subscription.id;

  if (shouldSendAcknowledgementEmail) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(clerkUserId);
      const stripeCustomer = await getStripeCustomer(
        stripeCustomerId || subscription.customer
      );

      const email =
        stripeCustomer?.email ||
        clerkUser?.emailAddresses?.[0]?.emailAddress ||
        null;

      const name =
        stripeCustomer?.name ||
        clerkUser?.firstName ||
        clerkUser?.fullName ||
        "there";

      await sendProAcknowledgementEmail({
        email,
        name,
        billingInterval: resolvedBillingInterval,
        status,
        validUntil: currentPeriodEnd,
        stripeSubscriptionId: subscription.id,
      });

      await supabase
        .from("subscriptions")
        .update({
          pro_ack_email_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", clerkUserId);
    } catch (emailError) {
      console.error("PRO_ACK_EMAIL_ERROR:", emailError);
    }
  }

  return {
    plan: "pro",
    status,
    stripeSubscriptionId: subscription.id,
    stripePriceId,
    billingInterval: resolvedBillingInterval,
    currentPeriodEnd,
  };
}

export async function markUserFree({ clerkUserId, status = "inactive" }) {
  if (!clerkUserId) {
    throw new Error("Missing clerkUserId in markUserFree.");
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      plan: "free",
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId);

  if (error) {
    console.error("SUPABASE_MARK_FREE_ERROR:", error);
    throw error;
  }

  await updateClerkUserToFree(clerkUserId, status);
}

export async function syncProAccessFromCheckoutSession(sessionId, expectedUserId) {
  if (!sessionId) {
    throw new Error("Missing Stripe checkout session ID.");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "customer"],
  });

  if (!session) {
    throw new Error("Stripe checkout session not found.");
  }

  if (session.payment_status !== "paid") {
    throw new Error(
      `Checkout session is not paid. Current status: ${session.payment_status}`
    );
  }

  const subscription =
    typeof session.subscription === "string"
      ? await stripe.subscriptions.retrieve(session.subscription)
      : session.subscription;

  if (!subscription?.id) {
    throw new Error("No Stripe subscription found on checkout session.");
  }

  const clerkUserId =
    session.metadata?.clerk_user_id ||
    subscription.metadata?.clerk_user_id ||
    session.customer?.metadata?.clerk_user_id ||
    null;

  if (!clerkUserId) {
    throw new Error(
      "Missing clerk_user_id from Stripe session/subscription/customer metadata."
    );
  }

  if (expectedUserId && clerkUserId !== expectedUserId) {
    throw new Error(
      "Authenticated Clerk user does not match Stripe checkout session user."
    );
  }

  const billingInterval =
    session.metadata?.billing_interval ||
    subscription.metadata?.billing_interval ||
    null;

  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  return markUserProFromSubscription({
    clerkUserId,
    stripeCustomerId,
    subscription,
    billingInterval,
  });
}