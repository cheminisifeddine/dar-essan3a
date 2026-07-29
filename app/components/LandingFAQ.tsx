"use client";

import { useState } from "react";

type Faq = { q: string; a: string };

export function LandingFAQ({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="bg-cream border border-gold/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-right font-tajawal font-bold text-ink hover:bg-gold/5 transition-colors"
          >
            <span>{f.q}</span>
            <span className="text-gold text-xl">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="px-5 pt-0 pb-5 font-tajawal text-muted leading-relaxed">{f.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default LandingFAQ;