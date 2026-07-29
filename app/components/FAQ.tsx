"use client";

import { useState } from "react";

const faqs = [
  {
    q: "هل الدفع عند الاستلام؟",
    a: "نعم، تدفع فقط عندما يصلك المنتج وتعاينه بنفسك.",
  },
  {
    q: "كم تدوم مدة التوصيل؟",
    a: "من 24 إلى 72 ساعة حسب الولاية.",
  },
  {
    q: "هل التوصيل متوفر في ولايتي؟",
    a: "نعم، نوصّل لجميع ولايات الوطن (58 ولاية)، للمنزل أو لمكتب شركة التوصيل (Stop Desk).",
  },
  {
    q: "كيف أطلب؟",
    a: "املأ الاستمارة بالاسم، رقم الهاتف، والعنوان، وسنتصل بك لتأكيد الطلب قبل الإرسال.",
  },
  {
    q: "هل يمكن استبدال المنتج؟",
    a: "إذا وصلك المنتج بعيب، تواصل معنا خلال 48 ساعة وسنستبدله لك.",
  },
  {
    q: "هل المنتجات مصنوعة يدوياً فعلاً؟",
    a: "نعم، كل قطعة من أيادي حرفيي بوسعادة، ولهذا قد تلاحظ فروقات بسيطة بين قطعة وأخرى — وهذا سرّ جمالها وأصالتها.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 md:py-24 bg-ivory">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-amiri text-3xl md:text-4xl text-deepgreen mb-3">الأسئلة الشائعة</h2>
          <div className="section-divider">
            <span className="text-gold text-xl">✦</span>
          </div>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-cream border border-gold/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right font-tajawal font-bold text-ink hover:bg-gold/5 transition-colors"
              >
                <span>{f.q}</span>
                <span className="text-gold text-xl">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="p-5 pt-0 font-tajawal text-muted leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
