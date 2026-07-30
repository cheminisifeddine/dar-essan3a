"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/customers", label: "الزبائن" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't require auth for the login page itself
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      setAuth(true);
      return;
    }
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setAuth(true);
        }
      })
      .catch(() => router.push("/admin/login"));
  }, [router, pathname]);

  async function handleLogout(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return <>{children}</>;
  }

  if (auth !== true) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-tajawal text-muted">
        <p>جارٍ التحقق…</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-cream text-ink font-tajawal">
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-deepgreen text-cream min-h-screen md:sticky md:top-0">
          <div className="p-6 border-b border-gold/20">
            <h1 className="font-amiri text-2xl text-gold">دار الصنعة</h1>
            <p className="text-sm text-cream/60">لوحة الإدارة</p>
          </div>
          <nav className="p-4 space-y-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 rounded-lg hover:bg-gold/10 text-cream/90 hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <form onSubmit={handleLogout} className="mt-6">
              <button
                type="submit"
                className="w-full text-right px-4 py-3 rounded-lg text-terracotta hover:bg-terracotta/10 transition-colors"
              >
                تسجيل الخروج
              </button>
            </form>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
