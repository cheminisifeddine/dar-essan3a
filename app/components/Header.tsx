import Image from "next/image";
import Link from "next/link";
import { STORE } from "../data/products";
import { Store } from "@/lib/db";
import { getStorePreviewUrl } from "@/lib/store";

export function Header({ store }: { store?: Partial<Store> | null }) {
  const storeName = store?.name || STORE.name;
  const whatsapp = store?.whatsapp_number || STORE.whatsapp;
  const fbPage = store?.fb_page || STORE.fbPage;
  const subdomain = store?.subdomain;
  const homeHref = subdomain && subdomain !== "main" ? getStorePreviewUrl(subdomain, "/") : "/";

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-gold/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gold/40 flex-shrink-0">
            <Image
              src={store?.logo_url || "/images/logo.webp"}
              alt={storeName}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="font-amiri text-2xl text-deepgreen leading-none">
                {storeName}
              </h1>
              {subdomain && subdomain !== "main" && (
                <span className="font-mono text-[10px] bg-gold/15 text-deepgreen px-2 py-0.5 rounded font-bold" dir="ltr">
                  {subdomain}.darelsanaa.com
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted font-tajawal leading-none mt-1 line-clamp-1 max-w-xs">
              {store?.hero_subtitle || "من بوسعادة… إلى بيتك"}
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-tajawal text-ink text-sm">
          <Link href={subdomain && subdomain !== "main" ? `/?store=${subdomain}#products` : "/#products"} className="hover:text-gold transition-colors">
            المنتجات
          </Link>
          <Link href="/#how-to-order" className="hover:text-gold transition-colors">
            كيف تطلب
          </Link>
          <Link href="/#faq" className="hover:text-gold transition-colors">
            الأسئلة الشائعة
          </Link>
          {fbPage && (
            <Link href={fbPage} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
              تواصل معنا
            </Link>
          )}
        </nav>

        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`السلام عليكم، أريد الاستفسار عن منتجات ${storeName}`)}`}
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
