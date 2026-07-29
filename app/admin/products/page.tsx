"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  active: number;
  images: string[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); setLoading(false); });
  }, []);

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: active ? 1 : 0 } : p)));
  }

  if (loading) return <p>جارٍ التحميل…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-amiri text-3xl text-deepgreen">المنتجات</h2>
        <Link href="/admin/products/new" className="bg-gold text-deepgreen px-4 py-2 rounded-lg font-bold hover:bg-gold/90">
          + منتج جديد
        </Link>
      </div>
      <div className="bg-ivory rounded-xl shadow-soft border border-gold/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-deepgreen/5 font-bold text-sm">
          <div className="col-span-5">المنتج</div>
          <div className="col-span-2">السعر</div>
          <div className="col-span-2">الحالة</div>
          <div className="col-span-3">إجراءات</div>
        </div>
        <div className="divide-y divide-gold/10">
          {products.map((p) => (
            <div key={p.id} className="p-4 md:grid md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5 flex items-center gap-3 mb-2 md:mb-0">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
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
              <div className="md:col-span-2 mb-2 md:mb-0">
                <span className="md:hidden text-muted">السعر: </span>
                {p.price.toLocaleString("ar-DZ")} دج
              </div>
              <div className="md:col-span-2 mb-2 md:mb-0">
                <button
                  onClick={() => toggleActive(p.id, !p.active)}
                  className={`px-3 py-1 rounded-full text-xs ${p.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}
                >
                  {p.active ? "نشط" : "معطل"}
                </button>
              </div>
              <div className="md:col-span-3 flex gap-2">
                <Link href={`/admin/products/${p.id}/edit`} className="text-gold hover:underline text-sm">
                  تعديل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
