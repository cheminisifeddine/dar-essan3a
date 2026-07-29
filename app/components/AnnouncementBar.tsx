export function AnnouncementBar() {
  return (
    <div className="bg-deepgreen text-gold text-sm py-2.5 text-center font-tajawal font-medium">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4">
        <span>💵 الدفع عند الاستلام</span>
        <span className="hidden sm:inline">|</span>
        <span>🚚 توصيل لـ 58 ولاية</span>
        <span className="hidden sm:inline">|</span>
        <span>🤲 صناعة يدوية 100% من بوسعادة</span>
      </div>
    </div>
  );
}

export default AnnouncementBar;
