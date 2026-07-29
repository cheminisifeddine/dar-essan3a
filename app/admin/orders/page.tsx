"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/orders?limit=100${status ? `&status=${status}` : ""}`)
      .then((r) => r.json())
      .then((data) => { setOrders(data.orders || []); setLoading(false); });
  }, [status]);

  if (loading) return <p>جارٍ التحميل…</p>;

  return (
    <div>
      <h2 className="font-amiri text-3xl text-deepgreen mb-6">الطلبات</h2>
      <div className="mb-4">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gold/30 rounded-xl px-4 py-2 bg-white">
          <option value="">كل الحالات</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div className="bg-ivory rounded-xl shadow-soft border border-gold/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-deepgreen/5 font-bold text-sm">
          <div className="col-span-1">#</div>
          <div className="col-span-3">الزبون</div>
          <div className="col-span-2">الولاية</div>
          <div className="col-span-2">المجموع</div>
          <div className="col-span-2">الحالة</div>
          <div className="col-span-2">إجراء</div>
        </div>
        <div className="divide-y divide-gold/10">
          {orders.length === 0 && <p className="p-6 text-center text-muted">لا توجد طلبات</p>}
          {orders.map((order) => (
            <div key={order.id} className="p-4 md:grid md:grid-cols-12 gap-4 items-center text-sm">
              <div className="md:col-span-1 mb-1 md:mb-0 font-bold">#{order.id}</div>
              <div className="md:col-span-3 mb-1 md:mb-0">
                <p className="font-bold">{order.customer_name}</p>
                <p className="text-muted">{order.phone}</p>
              </div>
              <div className="md:col-span-2 mb-1 md:mb-0">{order.wilaya} — {order.city}</div>
              <div className="md:col-span-2 mb-1 md:mb-0 font-bold">{order.total.toLocaleString("ar-DZ")} دج</div>
              <div className="md:col-span-2 mb-1 md:mb-0">
                <span className="px-2 py-1 rounded-full bg-gold/20 text-deepgreen text-xs">{statusLabels[order.status] || order.status}</span>
              </div>
              <div className="md:col-span-2">
                <Link href={`/admin/orders/${order.id}`} className="text-gold hover:underline">عرض التفاصيل</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
