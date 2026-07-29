import Image from "next/image";
import Link from "next/link";
import { STORE } from "../data/products";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-gold/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gold/40">
            <Image
              src="/images/logo.webp"
              alt={STORE.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-amiri text-2xl text-deepgreen leading-none">
              دار الصنعة
            </h1>
            <p className="text-[11px] text-muted font-tajawal leading-none mt-1">
              من بوسعادة… إلى بيتك
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-tajawal text-ink text-sm">
          <Link href="/#products" className="hover:text-gold transition-colors">
            المنتجات
          </Link>
          <Link href="/#how-to-order" className="hover:text-gold transition-colors">
            كيف تطلب
          </Link>
          <Link href="/#faq" className="hover:text-gold transition-colors">
            الأسئلة الشائعة
          </Link>
          <Link href={STORE.fbPage} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
            تواصل معنا
          </Link>
        </nav>

        <a
          href={`https://wa.me/${STORE.whatsapp}?text=السلام عليكم، أريد الاستفسار عن منتجات دار الصنعة`}
          target="_blank"
          rel="noreferrer"
          className="bg-deepgreen text-gold px-4 py-2 rounded-lg font-tajawal text-sm hover:bg-deepgreen/90 transition-colors"
        >
          واتساب
        </a>
      </div>
    </header>
  );
}

export default Header;
