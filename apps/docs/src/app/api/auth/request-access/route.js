import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateTemporaryPassword() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const length = 14;

  let password = "";

  for (let index = 0; index < length; index += 1) {
    password += alphabet[crypto.randomInt(0, alphabet.length)];
  }

  return password;
}

function splitName(fullName) {
  const safeName = fullName.trim().replace(/\s+/g, " ");
  const parts = safeName.split(" ");

  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getResendErrorMessage(error) {
  if (!error) return "";

  return (
    error.message ||
    error.name ||
    JSON.stringify(error, null, 2) ||
    "Unknown Resend error"
  );
}

async function sendTemporaryPasswordEmail({
  email,
  firstName,
  temporaryPassword,
  isRegenerated = false,
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const signInUrl = `${appUrl}/sign-in`;

  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [email],
    subject: isRegenerated
      ? "Your new Hyperiux Vault temporary password"
      : "Your Hyperiux Vault free account is ready",
    html: `
      <div style="font-family: Arial, sans-serif; background: #050505; color: #ffffff; padding: 32px;">
        <div style="max-width: 560px; margin: 0 auto; background: #111111; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 32px;">
          <p style="color: #ff6b00; text-transform: uppercase; letter-spacing: 0.18em; font-size: 12px; margin: 0 0 16px;">
            Hyperiux Vault
          </p>

          <h1 style="font-size: 28px; line-height: 1.1; margin: 0 0 16px;">
            ${
              isRegenerated
                ? "Your new temporary password is ready."
                : "Your free account is ready."
            }
          </h1>

          <p style="color: rgba(255,255,255,0.68); font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
            Hi ${firstName || "there"}, ${
              isRegenerated
                ? "we generated a new temporary password for your Hyperiux Vault account."
                : "your Hyperiux Vault free account has been created."
            } Use the credentials below to sign in.
          </p>

          <div style="background: #050505; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 10px; color: rgba(255,255,255,0.55); font-size: 13px;">Email</p>
            <p style="margin: 0 0 18px; font-size: 16px;">${email}</p>

            <p style="margin: 0 0 10px; color: rgba(255,255,255,0.55); font-size: 13px;">Temporary password</p>
            <p style="margin: 0; font-size: 20px; letter-spacing: 0.06em; font-weight: 700;">${temporaryPassword}</p>
          </div>

          <a href="${signInUrl}" style="display: inline-block; background: #ff6b00; color: #ffffff; text-decoration: none; border-radius: 999px; padding: 13px 22px; font-size: 14px; font-weight: 700;">
            Sign in to Hyperiux Vault
          </a>

          <p style="color: rgba(255,255,255,0.45); font-size: 13px; line-height: 1.6; margin: 24px 0 0;">
            Only the latest temporary password will work. If you request another password before signing in, this password will be replaced.
          </p>
        </div>
      </div>
    `,
  });

  if (result.error) {
    console.error("RESEND_EMAIL_ERROR:", result.error);
  }

  return result;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const userType = String(body.userType || "").trim();
    const organisationName = String(body.organisationName || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Please enter a valid name." },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!["student", "organisation", "other"].includes(userType)) {
      return NextResponse.json(
        {
          message:
            "Please select whether you are a student, organisation, or other.",
        },
        { status: 400 }
      );
    }

    if (userType === "organisation" && !organisationName) {
      return NextResponse.json(
        { message: "Please enter your organisation name." },
        { status: 400 }
      );
    }

    if (!process.env.CLERK_SECRET_KEY) {
      return NextResponse.json(
        { message: "CLERK_SECRET_KEY is missing in .env.local." },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "RESEND_API_KEY is missing in .env.local." },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json(
        { message: "RESEND_FROM_EMAIL is missing in .env.local." },
        { status: 500 }
      );
    }

    const client = await clerkClient();
    const { firstName, lastName } = splitName(name);
    const temporaryPassword = generateTemporaryPassword();

    const existingUsersResponse = await client.users.getUserList({
      emailAddress: [email],
      limit: 1,
    });

    const existingUser = existingUsersResponse?.data?.[0];

    if (existingUser) {
      const hasLoggedIn = Boolean(existingUser.lastSignInAt);

      if (hasLoggedIn) {
        return NextResponse.json(
          {
            message:
              "This account has already been used. Please sign in with your existing password.",
          },
          { status: 409 }
        );
      }

      await client.users.updateUser(existingUser.id, {
        password: temporaryPassword,
        firstName,
        lastName,
        publicMetadata: {
          ...existingUser.publicMetadata,
          plan: existingUser.publicMetadata?.plan || "free",
          accountStatus: "active",
          userType,
          organisationName: organisationName || null,
          source: "custom-access-request",
        },
        privateMetadata: {
          ...existingUser.privateMetadata,
          temporaryPasswordIssued: true,
          temporaryPasswordRegeneratedAt: new Date().toISOString(),
        },
      });

      const { error } = await sendTemporaryPasswordEmail({
        email,
        firstName,
        temporaryPassword,
        isRegenerated: true,
      });

      if (error) {
        const resendError = getResendErrorMessage(error);

        if (process.env.NODE_ENV === "development") {
          return NextResponse.json({
            ok: true,
            mode: "regenerated-dev",
            message:
              "Dev mode: a new Clerk password was generated, but Resend failed. Use the password below.",
            temporaryPassword,
            resendError,
          });
        }

        return NextResponse.json(
          {
            message:
              "A new password was generated, but the email could not be sent. Please contact support.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
        mode: "regenerated",
        message:
          "A new temporary password has been generated. Check your email for the latest login password.",
      });
    }

    const user = await client.users.createUser({
      emailAddress: [email],
      password: temporaryPassword,
      firstName,
      lastName,
      publicMetadata: {
        plan: "free",
        accountStatus: "active",
        userType,
        organisationName: organisationName || null,
        source: "custom-access-request",
      },
      privateMetadata: {
        temporaryPasswordIssued: true,
        requestedAt: new Date().toISOString(),
      },
    });

    const { error } = await sendTemporaryPasswordEmail({
      email,
      firstName,
      temporaryPassword,
      isRegenerated: false,
    });

    if (error) {
      const resendError = getResendErrorMessage(error);

      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          ok: true,
          mode: "created-dev",
          message:
            "Dev mode: your Clerk account was created, but Resend failed. Use the password below.",
          temporaryPassword,
          resendError,
          userId: user.id,
        });
      }

      return NextResponse.json(
        {
          message:
            "Your account was created, but the email could not be sent. Please contact support.",
          userId: user.id,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "created",
      message:
        "Your free account has been created. Check your email for the login password.",
    });
  } catch (error) {
    console.error("REQUEST_ACCESS_ERROR:", error);

    const clerkErrorMessage =
      error?.errors?.[0]?.longMessage ||
      error?.errors?.[0]?.message ||
      error?.message;

    return NextResponse.json(
      {
        message:
          clerkErrorMessage ||
          "Something went wrong while creating your account.",
      },
      { status: 500 }
    );
  }
}