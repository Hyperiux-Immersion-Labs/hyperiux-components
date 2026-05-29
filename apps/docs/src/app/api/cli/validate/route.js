import { supabase } from "@/lib/supabase";
import crypto from "crypto";
import { NextResponse } from "next/server";

// POST /api/cli/validate
// Called by the CLI before installing a pro effect.
// Accepts a plaintext token, hashes it, and checks against the subscriptions table.
// Returns { valid: true } or { valid: false, reason: "..." }
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false, reason: "Invalid request body." }, { status: 400 });
  }

  const { token } = body;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ valid: false, reason: "No token provided." }, { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("cli_token_hash", tokenHash)
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false, reason: "Token not found. Run `npx hyperiux login` again." });
  }

  if (data.status !== "active") {
    return NextResponse.json({ valid: false, reason: "Subscription is not active." });
  }

  if (data.plan !== "pro") {
    return NextResponse.json({ valid: false, reason: "A Pro subscription is required." });
  }

  if (data.current_period_end && new Date(data.current_period_end) < new Date()) {
    return NextResponse.json({ valid: false, reason: "Subscription has expired. Please renew at components.hyperiux.com." });
  }

  return NextResponse.json({ valid: true });
}
