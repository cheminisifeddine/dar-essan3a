import { Store } from "@/lib/db";

export function AnnouncementBar({ store }: { store?: Partial<Store> | null }) {
  const text =
    store?.announcement_bar ||
    "الدفع عند الاستلام 💵 | توصيل لـ 58 ولاية 🚚 | جودة مضمونة ✨";

  return (
    <div className="bg-deepgreen text-gold text-sm py-2.5 text-center font-tajawal font-medium">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4">
        <span>{text}</span>
      </div>
    </div>
  );
}

export default AnnouncementBar;
