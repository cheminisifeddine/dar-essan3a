"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Store } from "@/lib/db";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [status, setStatus] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [loading, setLoading] = useState(true);

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
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (status) params.set("status", status);
    if (selectedStore) params.set("store", selectedStore);

    fetch(`/api/admin/orders?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, [status, selectedStore]);

  function getStoreBadge(storeId?: string) {
    if (!storeId || storeId === "main") {
      return (
        <span className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded font-mono">
          darelsanaa.com
        </span>
      );
    }
    const found = stores.find((s) => s.subdomain === storeId || s.id === storeId);
    return (
      <span className="bg-gold/20 text-deepgreen text-[11px] px-2 py-0.5 rounded font-mono font-bold">
        {found ? `${found.subdomain}.darelsanaa.com` : storeId}
      </span>
    );
  }

  if (loading && orders.length === 0) return <p>جارٍ التحميل…</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-amiri text-3xl text-deepgreen">الطلبات</h2>
          <p className="text-sm text-muted">تتبع وإدارة الطلبات الواردة من كل المتاجر والنطاقات الفرعية</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Status filter */}
        <div>
          <label className="block text-xs text-muted mb-1">الحالة:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gold/30 rounded-xl px-4 py-2 bg-white text-sm"
          >
            <option value="">كل الحالات</option>
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Store filter */}
        <div>
          <label className="block text-xs text-muted mb-1">المتجر:</label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="border border-gold/30 rounded-xl px-4 py-2 bg-white text-sm"
          >
            <option value="">كل المتاجر</option>
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
      </div>

      <div className="bg-ivory rounded-xl shadow-soft border border-gold/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-deepgreen/5 font-bold text-sm">
          <div className="col-span-1">#</div>
          <div className="col-span-3">الزبون</div>
          <div className="col-span-2">المتجر</div>
          <div className="col-span-2">الولاية</div>
          <div className="col-span-2">المجموع</div>
          <div className="col-span-1">الحالة</div>
          <div className="col-span-1">إجراء</div>
        </div>
        <div className="divide-y divide-gold/10">
          {orders.length === 0 && <p className="p-6 text-center text-muted">لا توجد طلبات</p>}
          {orders.map((order) => (
            <div key={order.id} className="p-4 md:grid md:grid-cols-12 gap-4 items-center text-sm">
              <div className="md:col-span-1 mb-1 md:mb-0 font-bold">#{order.id}</div>
              <div className="md:col-span-3 mb-1 md:mb-0">
                <p className="font-bold">{order.customer_name}</p>
                <p className="text-muted text-xs">{order.phone}</p>
              </div>
              <div className="md:col-span-2 mb-1 md:mb-0">
                {getStoreBadge(order.store_id)}
              </div>
              <div className="md:col-span-2 mb-1 md:mb-0">{order.wilaya} — {order.city}</div>
              <div className="md:col-span-2 mb-1 md:mb-0 font-bold">{order.total.toLocaleString("ar-DZ")} دج</div>
              <div className="md:col-span-1 mb-1 md:mb-0">
                <span className="px-2 py-1 rounded-full bg-gold/20 text-deepgreen text-xs whitespace-nowrap">
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div className="md:col-span-1">
                <Link href={`/admin/orders/${order.id}`} className="text-gold hover:underline font-medium text-xs">
                  التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
