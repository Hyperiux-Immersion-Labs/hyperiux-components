import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("wishlisted_effects")
      .select("*")
      .eq("clerk_user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const savedEffects = (data || []).map(
      (item) => ({
        id: item.id,
        name: item.effect_slug,
        title: item.title,
        category: item.category,
        categorySlug: item.category,

        coverImage: item.cover_image,
        videoUrl: item.video_url,
        previewUrl: item.preview_url,

        tier: item.tier || "free",

        created_at: item.created_at,
      })
    );

    return NextResponse.json({
      savedEffects,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}