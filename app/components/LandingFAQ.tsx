"use client";

import { useState } from "react";

type Faq = {
  q: string;
  a: string;
};

const defaultFaqs: Faq[] = [
  { q: "هل الدفع عند الاستلام؟", a: "نعم، تدفع فقط عندما يصلك المنتج وتعاينه بنفسك." },
  { q: "كم تدوم مدة التوصيل؟", a: "من 24 إلى 72 ساعة حسب الولاية." },
  { q: "هل التوصيل متوفر في ولايتي؟", a: "نعم، نوصّل لجميع ولايات الوطن (58 ولاية)." },
  { q: "هل يمكن استبدال المنتج؟", a: "إذا وصلك المنتج بعيب، تواصل معنا خلال 48 ساعة وسنستبدله لك." },
];

export function LandingFAQ({ faqs }: { faqs?: Faq[] }) {
  const list = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-12 bg-ivory">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="font-amiri text-2xl text-deepgreen mb-6 text-center">الأسئلة الشائعة</h2>
        <div className="space-y-2">
          {list.map((f, i) => (
            <div key={i} className="bg-cream border border-gold/10 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-right font-tajawal font-bold text-ink">
                <span>{f.q}</span>
                <span className="text-gold text-lg">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <div className="px-4 pb-4 font-tajawal text-muted">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingFAQ;
