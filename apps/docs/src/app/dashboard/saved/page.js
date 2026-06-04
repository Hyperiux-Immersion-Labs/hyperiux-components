"use client";

import { useEffect, useMemo, useState } from "react";
import { EffectCard } from "@/components/ui/EffectCardNew";
import { effectCategories, getEffectCategory } from "@/lib/categories";

function getEffectCategories(effect) {
  return effect.categories?.length
    ? effect.categories
    : [effect.category || "others"];
}

export default function SavedPage() {
  const [savedEffects, setSavedEffects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  async function loadSavedEffects() {
    try {
      const res = await fetch("/api/dashboard/saved");

      if (!res.ok) {
        throw new Error("Failed to load saved effects");
      }

      const data = await res.json();

      setSavedEffects(data.savedEffects || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const toggleWishlist = async (effect) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ effect }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      if (data.saved === false) {
        setSavedEffects((prev) =>
          prev.filter((item) => item.name !== effect.name)
        );
      } else {
        loadSavedEffects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      loadSavedEffects();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const categoryFilters = useMemo(() => {
    const savedCategories = new Set();

    savedEffects.forEach((effect) => {
      getEffectCategories(effect).forEach((category) => {
        if (category) savedCategories.add(category);
      });
    });

    const knownCategories = effectCategories.filter(
      (category) => category.id === "all" || savedCategories.has(category.id)
    );
    const customCategories = [...savedCategories]
      .filter((category) => !getEffectCategory(category))
      .map((category) => ({
        id: category,
        name: category,
      }));

    return [...knownCategories, ...customCategories];
  }, [savedEffects]);

  const filteredEffects = useMemo(() => {
    if (activeCategory === "all") return savedEffects;

    return savedEffects.filter((effect) =>
      getEffectCategories(effect).includes(activeCategory)
    );
  }, [activeCategory, savedEffects]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-400">
          Loading saved effects...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display text-white">
          Saved Effects
        </h1>

        <p className="text-zinc-400 mt-2">
          Your wishlist of saved effects.
        </p>
      </div>

      {savedEffects.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {categoryFilters.map((category) => {
            const active = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-5 py-2.5 rounded-full border transition
                  ${active
                    ? "bg-white text-black border-white"
                    : "border-white/10 text-white/70 hover:bg-white hover:text-black"}
                `}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {savedEffects.length === 0 ? (
        <div className="border border-white/10 rounded-lg p-12 text-center bg-white/5 backdrop-blur-lg ">
          <h3 className="text-xl text-white mb-2">
            No saved effects yet
          </h3>

          <p className="text-zinc-400">
            Start exploring the vault and save your
            favourite effects.
          </p>
        </div>
      ) : filteredEffects.length === 0 ? (
        <div className="border border-white/10 rounded-lg p-12 text-center bg-white/5 backdrop-blur-lg ">
          <h3 className="text-xl text-white mb-2">
            No saved effects in this category
          </h3>

          <p className="text-zinc-400">
            Choose another category to view your saved effects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
          {filteredEffects.map((effect) => (
            <EffectCard
              key={effect.id}
              effect={effect}
              isWishlisted={true}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
