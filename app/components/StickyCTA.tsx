"use client";

import { STORE } from "../data/products";

export function StickyCTA({ text, href }: { text?: string; href?: string }) {
  return (
    <div className="sticky bottom-0 z-40 bg-ivory/95 backdrop-blur border-t border-gold/20 py-3 px-4 md:hidden">
      <a
        href={href || `https://wa.me/${STORE.whatsapp}`}
        target={href ? undefined : "_blank"}
        rel={href ? undefined : "noreferrer"}
        className="block w-full bg-gold text-deepgreen font-tajawal font-bold text-lg py-4 rounded-xl text-center shadow-soft"
      >
        {text || "اطلب الآن — الدفع عند الاستلام"}
      </a>
    </div>
  );
}

export default StickyCTA;
