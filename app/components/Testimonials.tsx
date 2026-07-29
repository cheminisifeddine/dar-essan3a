const testimonials = [
  {
    text: "القلة وصلتني لتيبازة في يومين، أجمل من الصور بكثير!",
    name: "أمينة ب.",
  },
  {
    text: "طلبت اللوحات هدية لأمي، بكت من الفرحة. شكراً دار الصنعة.",
    name: "يوسف م.، الجزائر العاصمة",
  },
  {
    text: "القبعة خفيفة وشيك، لبستها للبحر والكل سقساني عليها.",
    name: "ريم س.، عنابة",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-amiri text-3xl md:text-4xl text-deepgreen mb-3">آراء عملائنا</h2>
          <div className="section-divider">
            <span className="text-gold text-xl">✦</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-ivory border border-gold/10 rounded-2xl p-6 shadow-soft"
            >
              <div className="text-gold text-xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="font-tajawal text-ink leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <p className="font-tajawal text-sm text-muted">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
