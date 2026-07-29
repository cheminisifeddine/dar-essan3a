"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { STORE } from "../data/products";

declare global {
  interface Window {
    fbq?: any;
  }
}

export function initPixel() {
  if (typeof window === "undefined" || window.fbq) return;
  const n: any = (window.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  const s = document.getElementsByTagName("script")[0];
  s.parentNode?.insertBefore(t, s);
  window.fbq("init", STORE.pixelId);
  window.fbq("track", "PageView");
}

export function trackEvent(event: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

export function trackCustom(event: string, params?: Record<string, any>) {
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

export function PixelPageView() {
  return null;
}

export default PixelEvents;
