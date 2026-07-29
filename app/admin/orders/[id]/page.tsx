"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data.order); setLoading(false); });
  }, [id]);

  async function updateStatus(status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrder((o: any) => ({ ...o, status }));
  }

  if (loading) return <p>جارٍ التحميل…</p>;
  if (!order) return <p>الطلب غير موجود</p>;

  return (
    <div className="max-w-3xl">
      <h2 className="font-amiri text-3xl text-deepgreen mb-6">تفاصيل الطلب #{order.id}</h2>
      <div className="bg-ivory rounded-xl p-6 shadow-soft border border-gold/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p className="text-muted text-sm">الزبون</p><p className="font-bold">{order.customer_name}</p></div>
          <div><p className="text-muted text-sm">الهاتف</p><p className="font-bold ltr">{order.phone}</p></div>
          <div><p className="text-muted text-sm">الولاية</p><p className="font-bold">{order.wilaya}</p></div>
          <div><p className="text-muted text-sm">البلدية</p><p className="font-bold">{order.city}</p></div>
          <div><p className="text-muted text-sm">نوع التوصيل</p><p className="font-bold">{order.delivery_type === "home" ? "توصيل للمنزل" : "التوصيل للمكتب"}</p></div>
          <div><p className="text-muted text-sm">المجموع</p><p className="font-bold text-gold">{order.total.toLocaleString("ar-DZ")} دج</p></div>
        </div>
        {order.address && (
          <div>
            <p className="text-muted text-sm">العنوان</p>
            <p>{order.address}</p>
          </div>
        )}
        <div>
          <p className="text-muted text-sm mb-2">المنتجات</p>
          <ul className="space-y-2">
            {order.items?.map((item: any, i: number) => (
              <li key={i} className="bg-cream rounded-lg p-3 flex justify-between">
                <span>{item.product_name} × {item.qty}</span>
                <span className="font-bold">{item.price.toLocaleString("ar-DZ")} دج</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-muted text-sm mb-2">تحديث الحالة</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                className={`px-4 py-2 rounded-lg border ${order.status === s ? "bg-gold text-deepgreen border-gold" : "bg-white border-gold/30"}`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
