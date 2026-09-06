"use client";

import { useEffect, useRef } from "react";
import { initPixel } from "./PixelEvents";
import { STORE } from "../data/products";

// Per-store Meta Pixel: fires PageView to the store's own pixel_id in
// addition to the default one, so FB ads per store track correctly.
export function StorePixel({ pixelId }: { pixelId?: string | null }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    initPixel();
    if (
      pixelId &&
      pixelId !== STORE.pixelId &&
      typeof window !== "undefined" &&
      (window as any).fbq
    ) {
      try {
        (window as any).fbq("init", pixelId);
        (window as any).fbq("track", "PageView");
      } catch {}
    }
  }, [pixelId]);

  return null;
}

export default StorePixel;
