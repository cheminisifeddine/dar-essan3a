"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { STORE } from "../data/products";

type FbqParams = Record<string, unknown>;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fbq?: any;
  }
}

export function initPixel() {
  if (typeof window === "undefined" || window.fbq) return;
  // Official Meta Pixel snippet — uses dynamic function reference on purpose.
  /* eslint-disable @typescript-eslint/no-explicit-any, prefer-rest-params, prefer-spread, @typescript-eslint/no-unused-expressions */
  const n: any = (window.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  /* eslint-enable @typescript-eslint/no-explicit-any, prefer-rest-params, prefer-spread, @typescript-eslint/no-unused-expressions */
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  const s = document.getElementsByTagName("script")[0];
  s.parentNode?.insertBefore(t, s);
  window.fbq("init", STORE.pixelId);
  window.fbq("track", "PageView");
}

export function trackEvent(event: string, params?: FbqParams) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

export function trackCustom(event: string, params?: FbqParams) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", event, params);
  }
}

export function PixelEvents() {
  const pathname = usePathname();

  useEffect(() => {
    initPixel();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}

export default PixelEvents;