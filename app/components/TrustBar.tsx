const items = [
  { icon: "💵", label: "الدفع عند الاستلام" },
  { icon: "🚚", label: "توصيل لجميع الولايات" },
  { icon: "🤲", label: "صناعة يدوية أصلية" },
  { icon: "✨", label: "جودة مضمونة" },
];

export function TrustBar({ compact = false }: { compact?: boolean }) {
  return (
    <div className="bg-ivory border-y border-gold/10 py-5">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-2 ${compact ? "md:grid-cols-4" : "md:grid-cols-4"} gap-4 text-center`}>
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-tajawal text-sm md:text-base text-ink font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrustBar;
