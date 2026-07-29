export const runtime = "edge";
export const dynamic = "force-dynamic";

import { getStats, listOrders, listProducts } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentOrders = await listOrders(5, 0);
  const products = await listProducts(false);

  return (
    <div>
      <h2 className="font-amiri text-3xl text-deepgreen mb-6">لوحة التحكم</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-ivory rounded-xl p-6 shadow-soft border border-gold/10">
          <p className="text-muted text-sm">إجمالي الطلبات</p>
          <p className="font-amiri text-3xl text-deepgreen">{stats.totalOrders}</p>
        </div>
        <div className="bg-ivory rounded-xl p-6 shadow-soft border border-gold/10">
          <p className="text-muted text-sm">الإيرادات</p>
          <p className="font-amiri text-3xl text-deepgreen">{stats.totalRevenue.toLocaleString("ar-DZ")} دج</p>
        </div>
        <div className="bg-ivory rounded-xl p-6 shadow-soft border border-gold/10">
          <p className="text-muted text-sm">طلبات قيد الانتظار</p>
          <p className="font-amiri text-3xl text-terracotta">{stats.pendingOrders}</p>
        </div>
        <div className="bg-ivory rounded-xl p-6 shadow-soft border border-gold/10">
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
            {recentOrders.length === 0 && <p className="text-muted text-center py-4">لا توجد طلبات بعد</p>}
            {recentOrders.map((order) => (
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
