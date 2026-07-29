"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => { setCustomers(data.customers || []); setLoading(false); });
  }, []);

  if (loading) return <p>جارٍ التحميل…</p>;

  return (
    <div>
      <h2 className="font-amiri text-3xl text-deepgreen mb-6">الزبائن</h2>
      <div className="bg-ivory rounded-xl shadow-soft border border-gold/10 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-deepgreen/5 font-bold text-sm">
          <div className="col-span-4">الاسم</div>
          <div className="col-span-3">الهاتف</div>
          <div className="col-span-2">عدد الطلبات</div>
          <div className="col-span-3">إجمالي الشراء</div>
        </div>
        <div className="divide-y divide-gold/10">
          {customers.length === 0 && <p className="p-6 text-center text-muted">لا يوجد زبائن بعد</p>}
          {customers.map((c) => (
            <div key={c.phone} className="p-4 md:grid md:grid-cols-12 gap-4 items-center text-sm">
              <div className="md:col-span-4 mb-1 md:mb-0 font-bold">{c.name || "—"}</div>
              <div className="md:col-span-3 mb-1 md:mb-0 ltr">{c.phone}</div>
              <div className="md:col-span-2 mb-1 md:mb-0">{c.total_orders}</div>
              <div className="md:col-span-3 mb-1 md:mb-0 font-bold">{c.total_spent.toLocaleString("ar-DZ")} دج</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
