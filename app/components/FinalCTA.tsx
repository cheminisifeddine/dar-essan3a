import { STORE } from "../data/products";

export function FinalCTA() {
  return (
    <section className="bg-gold py-16 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-amiri text-3xl md:text-4xl text-deepgreen mb-4">
          اطلب اليوم… واحتفظ بقطعة من التراث
        </h2>
        <p className="font-tajawal text-deepgreen/80 mb-8 max-w-xl mx-auto">
          كل منتج من دار الصنعة يحمل قصة من بوسعادة. لا تدعه يفوتك.
        </p>
        <a
          href={`https://wa.me/${STORE.whatsapp}?text=السلام عليكم، أريد الاستفسار عن منتجات دار الصنعة`}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-deepgreen text-gold font-tajawal font-bold text-lg px-8 py-4 rounded-xl hover:bg-deepgreen/90 transition-colors shadow-soft"
        >
          اطلب الآن — الدفع عند الاستلام
        </a>
      </div>
    </section>
  );
}

export default FinalCTA;
