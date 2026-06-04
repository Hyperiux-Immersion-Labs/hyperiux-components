"use client";

import { useEffect, useState } from "react";

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch("/api/wishlist/list")
      .then((r) => r.json())
      .then((data) => {
        setWishlist(
          data.map((item) => item.effect_slug)
        );
      });
  }, []);

  return {
    wishlist,
    setWishlist,
  };
}