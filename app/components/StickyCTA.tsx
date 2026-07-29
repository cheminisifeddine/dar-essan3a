"use client";

import { useEffect, useState } from "react";

export function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const order = document.getElementById("order");
      const rect = order?.getBoundingClientRect();
      const inView = rect
        ? rect.top < window.innerHeight && rect.bottom > 0
        : false;
      setShow(window.scrollY > 650 && !inView);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-deepgreen text-cream px-4 py-3 flex items-center gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.25)]">
        <div className="flex-1">
          <p className="font-tajawal text-xs text-cream/70 leading-none mb-1">السعر اليوم</p>
          <p className="font-amiri text-xl text-gold font-bold leading-none">2,790 دج</p>
        </div>
        <a
          href="#order"
          className="bg-gold text-deepgreen font-tajawal font-bold px-6 py-3 rounded-xl shadow-soft hover:bg-gold/90 transition-colors"
        >
          اطلبي الآن
        </a>
      </div>
    </div>
  );
}

export default StickyCTA;