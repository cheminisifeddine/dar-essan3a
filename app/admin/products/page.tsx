"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store } from "@/lib/db";
import { useAdminStore } from "../components/AdminStoreContext";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  active: number;
  images: string[];
  store_id?: string;
};

export default function AdminProductsPage() {
  const { current } = useAdminStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [loading, setLoading] = useState(true);

  // Follow the sidebar store switcher: switching store re-scopes this page
  useEffect(() => {
    setSelectedStore(current === "all" ? "" : current);
  }, [current]);

  useEffect(() => {
    fetch("/api/admin/stores")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.stores)) {
          setStores(data.stores);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = selectedStore ? `?store=${encodeURIComponent(selectedStore)}` : "";
    fetch(`/api/admin/products${q}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, [selectedStore]);

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: active ? 1 : 0 } : p)));
  }

  function getStoreLabel(storeId?: string) {
    if (!storeId || storeId === "main") return "دار الصنعة (الرئيسي)";
    if (storeId === "all") return "جميع المتاجر";
    const found = stores.find((s) => s.subdomain === storeId || s.id === storeId);
    return found ? found.name : storeId;
  }

  if (loading && products.length === 0) return <p>جارٍ التحميل…</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-amiri text-3xl text-deepgreen">المنتجات</h2>
          <p className="text-sm text-muted">إدارة المنتجات وتوزيعها على المتاجر الفرعية</p>
        </div>
        <Link href="/admin/products/new" className="bg-gold text-deepgreen px-4 py-2 rounded-xl font-bold hover:bg-gold/90 shadow-soft">
          + منتج جديد
        </Link>
      </div>

      {/* Filter by store */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-muted font-medium">تصفية حسب المتجر:</label>
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="border border-gold/30 rounded-xl px-4 py-2 bg-white text-sm"
        >
          <option value="">كل المنتجات</option>
          <option value="main">المتجر الرئيسي (دار الصنعة)</option>
          {stores
            .filter((s) => s.id !== "main")
            .map((s) => (
              <option key={s.id} value={s.subdomain}>
                {s.name} ({s.subdomain}.darelsanaa.com)
              </option>
            ))}
        </select>
      </div>

      <div className="bg-ivory rounded-xl shadow-soft border border-gold/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-deepgreen/5 font-bold text-sm">
          <div className="col-span-4">المنتج</div>
          <div className="col-span-3">المتجر التابع له</div>
          <div className="col-span-2">السعر</div>
          <div className="col-span-1">الحالة</div>
          <div className="col-span-2">إجراءات</div>
        </div>
        <div className="divide-y divide-gold/10">
          {products.length === 0 && (
            <p className="p-6 text-center text-muted">لا توجد منتجات مطابقة لهذا المتجر.</p>
          )}
          {products.map((p) => (
            <div key={p.id} className="p-4 md:grid md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 flex items-center gap-3 mb-2 md:mb-0">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-center block pt-4">بدون صورة</span>
                  )}
                </div>
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-xs text-muted">{p.slug}</p>
                </div>
              </div>
              <div className="md:col-span-3 mb-2 md:mb-0">
                <span className="inline-block bg-gold/15 text-deepgreen text-xs px-2.5 py-1 rounded-full font-medium">
                  {getStoreLabel(p.store_id)}
                </span>
              </div>
              <div className="md:col-span-2 mb-2 md:mb-0">
                <span className="md:hidden text-muted">السعر: </span>
                {p.price.toLocaleString("ar-DZ")} دج
              </div>
              <div className="md:col-span-1 mb-2 md:mb-0">
                <button
                  onClick={() => toggleActive(p.id, !p.active)}
                  className={`px-3 py-1 rounded-full text-xs ${p.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}
                >
                  {p.active ? "نشط" : "معطل"}
                </button>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Link href={`/admin/products/${p.id}/edit`} className="text-gold hover:underline text-sm font-bold">
                  تعديل
                </Link>
                <Link
                  href={`/p/${p.slug}${p.store_id && p.store_id !== 'main' ? `?store=${p.store_id}` : ''}`}
                  target="_blank"
                  className="text-deepgreen/70 hover:text-deepgreen text-sm"
                >
                  عرض ↗
                </Link>
                <Link
                  href={`/l/${p.slug}${p.store_id && p.store_id !== 'main' ? `?store=${p.store_id}` : ''}`}
                  target="_blank"
                  className="text-terracotta hover:underline text-sm font-bold"
                  title="صفحة الهبوط الإعلانية (FB Ads)"
                >
                  لاندنغ ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
