export function NaturalGuarantee({ productName }: { productName?: string }) {
  const name = productName || "قوة الطبيعة";

  const points = [
    {
      icon: "🌿",
      title: "طبيعي 100%",
      text: "مكونات طبيعية مختارة بعناية، بدون مواد كيميائية ضارة.",
    },
    {
      icon: "🛡️",
      title: "آمن وغير ضار",
      text: "لطيف على الجسم ضمن الكمية الموصى بها على العبوة.",
    },
    {
      icon: "⚡",
      title: "فعّال 100%",
      text: "مصمم لرفع سعراتك اليومية بانتظام — الأساس الحقيقي لزيادة الوزن.",
    },
    {
      icon: "💵",
      title: "بدون مخاطرة",
      text: "عاين طلبك عند الاستلام وادفع فقط إذا أعجبك.",
    },
  ];

  return (
    <div className="bg-deepgreen rounded-2xl p-6 md:p-8 shadow-soft border border-gold/20">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="font-amiri text-2xl md:text-3xl text-gold font-bold">
          ضمان {name}
        </h3>
        <p className="font-tajawal text-cream/80 text-sm mt-2">
          وصفة طبيعية، آمنة، وفعّالة — أو لا تدفع شيئاً عند الاستلام
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {points.map((p) => (
          <div
            key={p.title}
            className="bg-white/5 border border-gold/20 rounded-xl p-4 flex items-start gap-3"
          >
            <span className="text-2xl shrink-0">{p.icon}</span>
            <div>
              <p className="font-tajawal font-bold text-gold mb-1">{p.title}</p>
              <p className="font-tajawal text-cream/80 text-sm leading-relaxed">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="font-tajawal text-cream/60 text-xs text-center mt-5 leading-relaxed">
        ملاحظة: النتائج تختلف من شخص لآخر حسب النظام الغذائي والاستمرارية. إذا كان لديك
        مرض مزمن، حساسية غذائية، أو تتناول أدوية، استشر مختصاً قبل الاستخدام.
      </p>
    </div>
  );
}

export default NaturalGuarantee;
