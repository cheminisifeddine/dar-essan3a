"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminStore, storeDomain } from "./components/AdminStoreContext";

export default function AdminDashboardPage() {
  const { current, currentStore } = useAdminStore();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Scope the whole dashboard to the switched store: each store gets its full admin view
    const q = current && current !== "all" ? `?store=${encodeURIComponent(current)}` : "";
    const q5 = current && current !== "all" ? `?limit=5&store=${encodeURIComponent(current)}` : "?limit=5";
    Promise.all([
      fetch(`/api/admin/stats${q}`).then((r) => r.json()),
      fetch(`/api/admin/orders${q5}`).then((r) => r.json()),
      fetch(`/api/admin/products${q}`).then((r) => r.json()),
      fetch("/api/admin/stores").then((r) => r.json()),
    ]).then(([statsData, ordersData, productsData, storesData]) => {
      setStats(statsData.stats || null);
      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
      setStores(storesData.stores || []);
      setLoading(false);
    });
  }, [current]);

  if (loading) return <p className="text-muted">جارٍ التحميل…</p>;
  if (!stats) return <p className="text-muted">لا توجد بيانات</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-amiri text-3xl text-deepgreen">لوحة التحكم</h2>
          {current === "all" ? (
            <p className="text-sm text-muted mt-1">🌐 تعرض بيانات <span className="font-bold">جميع المتاجر</span> — بدّل المتجر من القائمة الجانبية لعرض إدارة متجر واحد</p>
          ) : (
            <p className="text-sm text-muted mt-1">
              🏪 تدير الآن: <span className="font-bold text-deepgreen">{currentStore?.name || current}</span>{" "}
              <span className="font-mono text-gold" dir="ltr">{storeDomain(current)}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/stores/new"
            className="bg-deepgreen text-gold px-4 py-2 rounded-xl text-sm font-bold hover:bg-deepgreen/90 transition-colors"
          >
            + متجر جديد
          </Link>
          <Link
            href="/admin/products/new"
            className="bg-gold text-deepgreen px-4 py-2 rounded-xl text-sm font-bold hover:bg-gold/90 transition-colors"
          >
            + منتج جديد
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-ivory rounded-xl p-5 shadow-soft border border-gold/10">
          <p className="text-muted text-sm">المتاجر النشطة</p>
          <p className="font-amiri text-3xl text-deepgreen">{stores.length}</p>
          <Link href="/admin/stores" className="text-xs text-gold hover:underline mt-1 inline-block">
            إدارة النطاقات الفرعية ←
          </Link>
        </div>
        <div className="bg-ivory rounded-xl p-5 shadow-soft border border-gold/10">
          <p className="text-muted text-sm">إجمالي الطلبات</p>
          <p className="font-amiri text-3xl text-deepgreen">{stats.totalOrders}</p>
        </div>
        <div className="bg-ivory rounded-xl p-5 shadow-soft border border-gold/10">
          <p className="text-muted text-sm">الإيرادات</p>
          <p className="font-amiri text-3xl text-deepgreen">{stats.totalRevenue.toLocaleString("ar-DZ")} دج</p>
        </div>
        <div className="bg-ivory rounded-xl p-5 shadow-soft border border-gold/10">
          <p className="text-muted text-sm">طلبات قيد الانتظار</p>
          <p className="font-amiri text-3xl text-terracotta">{stats.pendingOrders}</p>
        </div>
        <div className="bg-ivory rounded-xl p-5 shadow-soft border border-gold/10">
          <p className="text-muted text-sm">الزبائن</p>
          <p className="font-amiri text-3xl text-deepgreen">{stats.totalCustomers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-ivory rounded-xl p-5 shadow-soft border border-gold/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-amiri text-xl text-deepgreen">آخر الطلبات</h3>
            <Link href="/admin/orders" className="text-gold hover:underline text-sm">عرض الكل</Link>
          </div>
          <div className="space-y-3">
            {orders.length === 0 && <p className="text-muted text-center py-4">لا توجد طلبات بعد</p>}
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-cream rounded-lg">
                <div>
                  <p className="font-medium">#{order.id} — {order.customer_name}</p>
                  <p className="text-sm text-muted">{order.wilaya} — {order.city}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold">{order.total.toLocaleString("ar-DZ")} دج</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-gold/20 text-deepgreen">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ivory rounded-xl p-5 shadow-soft border border-gold/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-amiri text-xl text-deepgreen">المنتجات</h3>
            <Link href="/admin/products" className="text-gold hover:underline text-sm">إدارة</Link>
          </div>
          <p className="text-muted">عدد المنتجات: <span className="text-ink font-bold">{products.length}</span></p>
          <p className="text-muted">نشط: <span className="text-ink font-bold">{products.filter((p) => p.active).length}</span></p>
          <p className="text-muted">معطل: <span className="text-ink font-bold">{products.filter((p) => !p.active).length}</span></p>
        </div>
      </div>
    </div>
  );
}
