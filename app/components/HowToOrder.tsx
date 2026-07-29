const steps = [
  { num: "①", title: "اختر منتجك واملأ الاستمارة" },
  { num: "②", title: "نتصل بك للتأكيد" },
  { num: "③", title: "يصلك المنتج وتدفع عند الاستلام" },
];

export function HowToOrder() {
  return (
    <section id="how-to-order" className="py-16 md:py-24 bg-ivory">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-amiri text-3xl md:text-4xl text-deepgreen mb-3">كيف تطلب؟</h2>
          <div className="section-divider">
            <span className="text-gold text-xl">✦</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-cream border border-gold/10 rounded-2xl p-8 text-center shadow-soft hover:border-gold/30 transition-colors"
            >
              <div className="font-amiri text-5xl text-gold mb-4">{step.num}</div>
              <p className="font-tajawal text-lg text-ink font-medium">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowToOrder;
