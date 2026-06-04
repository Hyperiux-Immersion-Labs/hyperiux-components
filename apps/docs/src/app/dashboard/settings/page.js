"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const fileInputRef = useRef(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleProfileSubmit(event) {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();

    setSavingProfile(true);
    setMessage("");
    setError("");

    try {
      await user.update({
        firstName,
        lastName,
      });
      await user.reload();
      setMessage("Profile updated.");
    } catch (err) {
      console.error(err);
      setError("Unable to update your profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!user || !file) return;

    setSavingImage(true);
    setMessage("");
    setError("");

    try {
      await user.setProfileImage({ file });
      await user.reload();
      setMessage("Profile picture updated.");
    } catch (err) {
      console.error(err);
      setError("Unable to update your profile picture.");
    } finally {
      setSavingImage(false);
      event.target.value = "";
    }
  }

  if (!isLoaded) {
    return (
      <div className="text-white p-10">
        Loading settings...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="border border-white/10 rounded-2xl p-8">
        Sign in to manage your settings.
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      <div className="border border-white/10 rounded-lg p-8 bg-white/5 backdrop-blur-lg  h-fit ">
        <div className="relative w-32 h-32">
          <Image
            src={user.imageUrl}
            alt={user.fullName || "Profile picture"}
            fill
            sizes="128px"
            className="rounded-full object-cover border border-white/10"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={savingImage}
            className="absolute bottom-1 right-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition duration-300 hover:bg-[#ff5f00] hover:text-white disabled:opacity-60 cursor-pointer"
            aria-label="Update profile picture"
          >
            {savingImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <h2 className="text-2xl font-semibold mt-6">
          {user.fullName || "Your profile"}
        </h2>

        <p className="mt-2 break-all">
          {user.primaryEmailAddress?.emailAddress}
        </p>
      </div>

      <div className="border border-white/10 rounded-lg p-8 bg-white/5 backdrop-blur-lg ">
        <div className="mb-8">
          <h2 className="text-3xl">
            Settings
          </h2>

          <p className="mt-2">
            Update your account name and profile picture.
          </p>
        </div>

        <form
          key={user.id}
          onSubmit={handleProfileSubmit}
          className="space-y-6 max-w-2xl"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">
                First name
              </span>

              <input
                name="firstName"
                defaultValue={user.firstName || ""}
                className="mt-2 w-full rounded-xl border border-white/10  px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </label>

            <label className="block">
              <span className="text-sm">
                Last name
              </span>

              <input
                name="lastName"
                defaultValue={user.lastName || ""}
                className="mt-2 w-full rounded-xl border border-white/10  px-4 py-3 text-white outline-none transition focus:border-white/40"
              />
            </label>
          </div>

          <div>
            <p className="text-sm">
              Email
            </p>

            <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white/70">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          {(message || error) && (
            <p className={error ? "text-red-400" : "text-emerald-400"}>
              {error || message}
            </p>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-black transition hover:bg-[#ff5f00] hover:text-white duration-300 disabled:opacity-60 cursor-pointer"
          >
            {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}
