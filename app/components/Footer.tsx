import Image from "next/image";
import Link from "next/link";
import { STORE } from "../data/products";
import { Store } from "@/lib/db";

export function Footer({ store }: { store?: Partial<Store> | null }) {
  const storeName = store?.name || "دار الصنعة";
  const whatsapp = store?.whatsapp_number || STORE.whatsapp;
  const isCustomStore = store?.subdomain && store?.subdomain !== "main";

  return (
    <footer className="bg-deepgreen text-cream pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center mb-10">
          <div className="text-center md:text-right">
            <div className="w-16 h-16 relative rounded-full overflow-hidden border border-gold/40 mx-auto md:mx-0 mb-4">
              <Image src={store?.logo_url || "/images/logo.webp"} alt={storeName} fill className="object-cover" />
            </div>
            <h3 className="font-amiri text-2xl text-gold mb-2">{storeName}</h3>
            <p className="font-tajawal text-cream/70 text-sm">
              {store?.description || "منتجات جزائرية أصلية | توصيل لكل أنحاء الوطن"}
            </p>
            {isCustomStore && (
              <p className="font-mono text-xs text-gold/80 mt-1" dir="ltr">
                {store.subdomain}.darelsanaa.com
              </p>
            )}
          </div>

          <div className="text-center">
            <h4 className="font-tajawal font-bold text-gold mb-4">روابط سريعة</h4>
            <div className="flex flex-col gap-2 font-tajawal text-sm">
              <Link href="/#products" className="text-cream/80 hover:text-gold transition-colors">المنتجات</Link>
              <Link href="/#how-to-order" className="text-cream/80 hover:text-gold transition-colors">كيف تطلب</Link>
              <Link href="/#faq" className="text-cream/80 hover:text-gold transition-colors">الأسئلة الشائعة</Link>
              <Link href="/p/chapeau-palmier" className="text-cream/80 hover:text-gold transition-colors">قبعة النخيل</Link>
              <Link href="/p/qolla-tissage" className="text-cream/80 hover:text-gold transition-colors">قلة بوسعادة</Link>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-tajawal font-bold text-gold mb-4">تواصل معنا</h4>
            <p className="font-tajawal text-cream/80 text-sm mb-3">نجيب يومياً من 9:00 إلى 21:00</p>
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`السلام عليكم، أريد الاستفسار عن منتجات ${storeName}`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-gold text-deepgreen font-tajawal font-bold px-5 py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
            >
              واتساب
            </a>
          </div>
        </div>

        <div className="border-t border-gold/20 pt-6 text-center font-tajawal text-sm text-cream/60">
          <p>© {storeName} 2026 — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
