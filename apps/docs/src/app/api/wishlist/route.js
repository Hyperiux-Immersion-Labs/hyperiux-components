import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function normalizeEffectPayload(payload = {}) {
  const source = payload?.effect || payload || {};
  const name = source.name || source.slug || source.effectSlug;

  if (!name) return null;

  return {
    ...source,
    name,
    title: source.title || name,
    coverImage: source.coverImage || source.imageSrc || source.cover_image || null,
    videoUrl: source.videoUrl || source.videoURL || source.video_url || null,
    previewUrl: source.previewUrl || source.preview_url || null,
    tier: source.tier || "free",
  };
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Returns all wishlist items for current user
*/

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await supabase
      .from("wishlisted_effects")
      .select("*")
      .eq("clerk_user_id", userId);

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
| Toggle wishlist
|--------------------------------------------------------------------------
*/

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await req.json();
    const effect = normalizeEffectPayload(payload);

    if (!effect) {
      return NextResponse.json(
        { error: "Effect is required" },
        { status: 400 }
      );
    }

    const category =
      effect.categories?.[0] ||
      effect.category ||
      "others";

    const { data: existing } = await supabase
      .from("wishlisted_effects")
      .select("id")
      .eq("clerk_user_id", userId)
      .eq("effect_slug", effect.name)
      .maybeSingle();

    /*
    |--------------------------------------------------------------------------
    | Remove if already saved
    |--------------------------------------------------------------------------
    */

    if (existing) {
      await supabase
        .from("wishlisted_effects")
        .delete()
        .eq("clerk_user_id", userId)
        .eq("effect_slug", effect.name);

      return NextResponse.json({
        saved: false,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Save new effect
    |--------------------------------------------------------------------------
    */

    const { error } = await supabase
      .from("wishlisted_effects")
      .insert({
        clerk_user_id: userId,

        effect_slug: effect.name,

        category,

        title: effect.title,

        cover_image: effect.coverImage || null,

        video_url: effect.videoUrl || null,

        preview_url: effect.previewUrl || null,

        tier: effect.tier || "free",
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      saved: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await req.json();
    const effect = normalizeEffectPayload(payload);

    if (!effect) {
      return NextResponse.json(
        { error: "Effect is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("wishlisted_effects")
      .delete()
      .eq("clerk_user_id", userId)
      .eq("effect_slug", effect.name);

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      saved: false,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
