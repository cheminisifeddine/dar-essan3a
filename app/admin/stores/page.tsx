"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store } from "@/lib/db";
import { MAIN_DOMAIN } from "@/lib/store";

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function loadStores() {
    setLoading(true);
    fetch("/api/admin/stores")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStores(data.stores || []);
        } else {
          setError(data.error || "تعذر تحميل المتاجر");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("خطأ في الاتصال بالخادم");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadStores();
  }, []);

  async function toggleActive(store: Store) {
    const newActive = store.active ? 0 : 1;
    await fetch(`/api/admin/stores/${store.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: newActive }),
    });
    setStores((prev) => prev.map((s) => (s.id === store.id ? { ...s, active: newActive } : s)));
  }

  async function handleDelete(id: string, name: string) {
    if (id === "main") {
      alert("لا يمكن حذف المتجر الرئيسي.");
      return;
    }
    if (!confirm(`هل أنت متأكد من رغبتك في حذف متجر "${name}"؟`)) return;

    const res = await fetch(`/api/admin/stores/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setStores((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(data.error || "حدث خطأ أثناء الحذف");
    }
  }

  if (loading) return <p className="text-muted">جارٍ تحميل المتاجر…</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-amiri text-3xl text-deepgreen">إدارة المتاجر المتعددة</h2>
          <p className="text-sm text-muted mt-1">
            أنشئ متاجر متعددة لكل بائع أو فئة، بألوان نصوص فريدة وهوية ونطاق فرعي تحت{" "}
            <span className="font-mono text-deepgreen font-bold" dir="ltr">.{MAIN_DOMAIN}</span> (مثل{" "}
            <span className="font-mono text-gold font-bold" dir="ltr">sante.{MAIN_DOMAIN}</span>)
          </p>
        </div>
        <Link
          href="/admin/stores/new"
          className="bg-gold text-deepgreen px-5 py-2.5 rounded-xl font-bold hover:bg-gold/90 transition-colors shadow-soft whitespace-nowrap"
        >
          + إنشاء متجر جديد
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {stores.map((store) => {
          const isMain = store.subdomain === "main";
          const subdomainDisplay = isMain ? MAIN_DOMAIN : `${store.subdomain}.${MAIN_DOMAIN}`;
          const previewQuery = isMain ? "/" : `/?store=${encodeURIComponent(store.subdomain)}`;

          return (
            <div
              key={store.id}
              className="bg-ivory rounded-2xl p-6 shadow-soft border border-gold/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-amiri text-2xl text-deepgreen font-bold">{store.name}</h3>
                  {isMain ? (
                    <span className="bg-gold/20 text-deepgreen text-xs px-2.5 py-1 rounded-full font-bold">
                      المتجر الرئيسي
                    </span>
                  ) : (
                    <span className="bg-deepgreen/10 text-deepgreen text-xs px-2.5 py-1 rounded-full font-bold">
                      متجر فرعي
                    </span>
                  )}
                  <button
                    onClick={() => toggleActive(store)}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                      store.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {store.active ? "نشط" : "معطل"}
                  </button>
                </div>

                {/* Subdomain row */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">النطاق:</span>
                  <a
                    href={`https://${subdomainDisplay}`}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="font-mono text-deepgreen font-bold underline hover:text-gold transition-colors"
                  >
                    {subdomainDisplay}
                  </a>
                  <span className="text-muted">|</span>
                  <Link
                    href={previewQuery}
                    target="_blank"
                    className="text-xs bg-gold/15 text-deepgreen hover:bg-gold/30 px-2.5 py-1 rounded-lg transition-colors font-medium"
                  >
                    👁️ معاينة مباشرة
                  </Link>
                </div>

                {store.hero_title && (
                  <p className="text-sm text-muted">
                    <span className="font-medium text-ink">العنوان:</span> {store.hero_title}
                  </p>
                )}

                {/* Visual Colors Row */}
                <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-medium">
                  <span className="text-muted">ألوان المتجر:</span>

                  {/* Text Color */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1 shadow-sm">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: store.text_color }}
                    />
                    <span className="text-muted">لون النص:</span>
                    <span className="font-mono font-bold" style={{ color: store.text_color }}>
                      {store.text_color} (Aa)
                    </span>
                  </div>

                  {/* Primary Color */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1 shadow-sm">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: store.primary_color }}
                    />
                    <span className="text-muted">الأساسي:</span>
                    <span className="font-mono">{store.primary_color}</span>
                  </div>

                  {/* Secondary Color */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1 shadow-sm">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: store.secondary_color }}
                    />
                    <span className="text-muted">المميّز:</span>
                    <span className="font-mono">{store.secondary_color}</span>
                  </div>

                  {/* Background Color */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1 shadow-sm">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: store.bg_color }}
                    />
                    <span className="text-muted">الخلفية:</span>
                    <span className="font-mono">{store.bg_color}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap lg:flex-col items-stretch gap-2 w-full lg:w-auto">
                <Link
                  href={`/admin/stores/${store.id}/edit`}
                  className="text-center bg-deepgreen text-gold px-4 py-2 rounded-xl text-sm font-bold hover:bg-deepgreen/90 transition-colors"
                >
                  تعديل الهوية والألوان
                </Link>
                <Link
                  href={previewQuery}
                  target="_blank"
                  className="text-center border border-gold/40 text-deepgreen px-4 py-2 rounded-xl text-sm font-medium hover:bg-gold/10 transition-colors"
                >
                  فتح المتجر ↗
                </Link>
                {!isMain && (
                  <button
                    onClick={() => handleDelete(store.id, store.name)}
                    className="text-center text-terracotta border border-terracotta/30 hover:bg-terracotta/10 px-4 py-2 rounded-xl text-sm transition-colors"
                  >
                    حذف المتجر
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
