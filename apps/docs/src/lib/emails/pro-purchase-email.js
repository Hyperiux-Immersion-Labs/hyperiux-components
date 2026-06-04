export function getBillingLabel(interval) {
  const labels = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
  };

  return labels[interval] || "Pro";
}

export function formatEmailDate(value) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function createProPurchaseEmail({
  name = "there",
  billingInterval,
  status,
  validUntil,
  stripeSubscriptionId,
}) {
  const planName = `${getBillingLabel(billingInterval)} Pro`;
  const validity = formatEmailDate(validUntil);

  const subject = `Your Hyperiux Vault Pro access is active`;

  const text = `
Hi ${name},

Your Hyperiux Vault ${planName} subscription is now active.

Plan: ${planName}
Status: ${status || "active"}
Valid until / renews on: ${validity}
Subscription ID: ${stripeSubscriptionId || "Not available"}

Your Pro access includes:
- 100+ premium interactive effects
- Copy-paste React and Next.js components
- Hyperiux CLI installation support
- Scroll effects, WebGL effects, loaders, navbars, buttons, sliders, text animations, and transitions
- Priority access to upcoming component releases
- Commercial-friendly implementation structure
- Clean documentation and usage examples
- New effects added continuously

You can now access the full vault from your dashboard.

Hyperiux Vault
`;

  const html = `
    <div style="margin:0;padding:0;background:#050505;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
      <div style="max-width:620px;margin:0 auto;padding:40px 24px;">
        <div style="border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);border-radius:28px;padding:32px;">
          <p style="margin:0 0 14px;color:#ff5f00;font-size:12px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;">
            Hyperiux Vault
          </p>

          <h1 style="margin:0;color:#ffffff;font-size:36px;line-height:1.05;font-weight:500;letter-spacing:-0.04em;">
            Your Pro access is active.
          </h1>

          <p style="margin:18px 0 0;color:rgba(255,255,255,0.68);font-size:16px;line-height:1.7;">
            Hi ${name}, your <strong style="color:#ffffff;">${planName}</strong> subscription has been activated successfully.
          </p>

          <div style="margin:28px 0;padding:20px;border:1px solid rgba(255,255,255,0.1);background:#0d0d0d;border-radius:20px;">
            <p style="margin:0 0 10px;color:rgba(255,255,255,0.5);font-size:13px;">Plan</p>
            <p style="margin:0 0 18px;color:#ffffff;font-size:20px;font-weight:600;">${planName}</p>

            <p style="margin:0 0 10px;color:rgba(255,255,255,0.5);font-size:13px;">Status</p>
            <p style="margin:0 0 18px;color:#ffffff;font-size:20px;font-weight:600;text-transform:capitalize;">${status || "active"}</p>

            <p style="margin:0 0 10px;color:rgba(255,255,255,0.5);font-size:13px;">Valid until / Renews on</p>
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">${validity}</p>
          </div>

          <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;line-height:1.2;font-weight:600;">
            What you now have access to
          </h2>

          <ul style="margin:0;padding:0;list-style:none;color:rgba(255,255,255,0.72);font-size:15px;line-height:1.8;">
            <li>✓ 100+ premium interactive effects</li>
            <li>✓ Copy-paste React and Next.js components</li>
            <li>✓ Hyperiux CLI installation support</li>
            <li>✓ Scroll effects, WebGL effects, loaders, navbars, buttons, sliders, text animations, and transitions</li>
            <li>✓ Priority access to upcoming component releases</li>
            <li>✓ Commercial-friendly implementation structure</li>
            <li>✓ Clean documentation and usage examples</li>
            <li>✓ New effects added continuously</li>
          </ul>

          <p style="margin:28px 0 0;color:rgba(255,255,255,0.45);font-size:13px;line-height:1.7;">
            Subscription ID: ${stripeSubscriptionId || "Not available"}
          </p>
        </div>
      </div>
    </div>
  `;

  return {
    subject,
    text,
    html,
  };
}