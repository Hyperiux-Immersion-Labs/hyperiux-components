import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getUserPlan } from "@/lib/subscription";
import crypto from "crypto";
import { NextResponse } from "next/server";

// POST /api/cli/token
// Generates a new CLI token for the authenticated user and stores its hash in Supabase.
// The plaintext token is returned once and never stored.
export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only pro subscribers can generate a CLI token
  const plan = await getUserPlan(userId);
  if (plan !== "pro") {
    return NextResponse.json(
      { error: "A Hyperiux Pro subscription is required to generate a CLI token." },
      { status: 403 }
    );
  }

  // Generate a cryptographically random 32-byte token
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const { error } = await supabase
    .from("subscriptions")
    .update({
      cli_token_hash: tokenHash,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("Failed to store CLI token hash:", error);
    return NextResponse.json({ error: "Failed to generate token." }, { status: 500 });
  }

  // Return the plaintext token — shown once to the user, never stored
  return NextResponse.json({ token });
}
