"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "@/lib/db";

export default function NewProductPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    hook: "",
    description: "",
    price: "",
    old_price: "",
    bullets: [""],
    images: [] as string[],
    active: true,
    sort_order: "0",
    store_id: "main",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", form.slug || "new");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.success) {
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      price: Number(form.price),
      old_price: Number(form.old_price || 0),
      bullets: form.bullets.filter(Boolean),
      sort_order: Number(form.sort_order),
    };
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) router.push("/admin/products");
  }

  return (
    <div>
      <h2 className="font-amiri text-3xl text-deepgreen mb-6">منتج جديد</h2>
      <form onSubmit={handleSubmit} className="bg-ivory rounded-xl p-6 shadow-soft border border-gold/10 max-w-3xl space-y-4">
        {/* Store Selection */}
        <div>
          <label className="block text-sm text-muted mb-1 font-bold">المتجر التابع له المنتج</label>
          <select
            value={form.store_id}
            onChange={(e) => setForm({ ...form, store_id: e.target.value })}
            className="w-full border border-gold/30 rounded-xl px-4 py-3 bg-white"
          >
            <option value="main">المتجر الرئيسي (دار الصنعة — darelsanaa.com)</option>
            {stores
              .filter((s) => s.id !== "main")
              .map((s) => (
                <option key={s.id} value={s.subdomain}>
                  {s.name} ({s.subdomain}.darelsanaa.com)
                </option>
              ))}
            <option value="all">متاح في جميع المتاجر</option>
          </select>
        </div>

        <input placeholder="اسم المنتج" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" required />
        <input placeholder="Slug (بالإنجليزية)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" dir="ltr" required />
        <input placeholder="جملة افتتاحية" value={form.hook} onChange={(e) => setForm({ ...form, hook: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" />
        <textarea placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full border border-gold/30 rounded-xl px-4 py-3" />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="السعر" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" required />
          <input type="number" placeholder="السعر القديم" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" />
        </div>
        <div>
          <label className="text-sm text-muted">الميزات</label>
          {form.bullets.map((b, i) => (
            <input
              key={i}
              value={b}
              onChange={(e) => {
                const arr = [...form.bullets];
                arr[i] = e.target.value;
                setForm({ ...form, bullets: arr });
              }}
              className="w-full border border-gold/30 rounded-xl px-4 py-2 mb-2"
              placeholder={`ميزة ${i + 1}`}
            />
          ))}
          <button type="button" onClick={() => setForm({ ...form, bullets: [...form.bullets, ""] })} className="text-gold text-sm">+ إضافة ميزة</button>
        </div>
        <div>
          <label className="text-sm text-muted">الصور</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
            className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gold file:text-deepgreen"
          />
          {uploading && <p className="text-sm text-muted mt-2">جارٍ الرفع…</p>}
          <div className="flex gap-2 mt-3 flex-wrap">
            {form.images.map((img, i) => (
              <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gold/20" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} id="active" />
          <label htmlFor="active">نشط</label>
        </div>
        <button type="submit" disabled={saving} className="w-full bg-gold text-deepgreen font-bold py-3 rounded-xl hover:bg-gold/90 disabled:opacity-70">
          {saving ? "جارٍ الحفظ…" : "حفظ المنتج"}
        </button>
      </form>
    </div>
  );
}
