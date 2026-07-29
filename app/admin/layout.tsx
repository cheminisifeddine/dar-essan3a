import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

async function isAuthenticated() {
  const token = cookies().get("admin_session")?.value;
  if (!token) return false;
  try {
    const db = (process.env as any).DB as any;
    if (!db) return false;
    const row = await db.prepare("SELECT * FROM admin_sessions WHERE token = ? AND expires_at > ?").bind(token, Math.floor(Date.now() / 1000)).first();
    return !!row;
  } catch {
    return false;
  }
}

const nav = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/customers", label: "الزبائن" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAuthenticated();
  if (!auth) {
    redirect("/admin/login");
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
            <form action="/api/admin/logout" method="POST" className="mt-6">
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
