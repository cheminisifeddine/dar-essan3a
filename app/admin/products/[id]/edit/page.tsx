"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((data) => setForm(data.product));
  }, [id]);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", form?.slug || "edit");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.success) {
      setForm((f: any) => ({ ...f, images: [...f.images, data.url] }));
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
      active: !!form.active,
      sort_order: Number(form.sort_order || 0),
    };
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) router.push("/admin/products");
  }

  if (!form) return <p>جارٍ التحميل…</p>;

  return (
    <div>
      <h2 className="font-amiri text-3xl text-deepgreen mb-6">تعديل المنتج</h2>
      <form onSubmit={handleSubmit} className="bg-ivory rounded-xl p-6 shadow-soft border border-gold/10 max-w-3xl space-y-4">
        <input placeholder="اسم المنتج" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" required />
        <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" dir="ltr" required />
        <input placeholder="جملة افتتاحية" value={form.hook} onChange={(e) => setForm({ ...form, hook: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" />
        <textarea placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full border border-gold/30 rounded-xl px-4 py-3" />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="السعر" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" required />
          <input type="number" placeholder="السعر القديم" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-3" />
        </div>
        <div>
          <label className="text-sm text-muted">الميزات</label>
          {form.bullets.map((b: string, i: number) => (
            <input
              key={i}
              value={b}
              onChange={(e) => {
                const arr = [...form.bullets];
                arr[i] = e.target.value;
                setForm({ ...form, bullets: arr });
              }}
              className="w-full border border-gold/30 rounded-xl px-4 py-2 mb-2"
            />
          ))}
          <button type="button" onClick={() => setForm({ ...form, bullets: [...form.bullets, ""] })} className="text-gold text-sm">+ إضافة ميزة</button>
        </div>
        <div>
          <label className="text-sm text-muted">الصور</label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gold file:text-deepgreen" />
          {uploading && <p className="text-sm text-muted mt-2">جارٍ الرفع…</p>}
          <div className="flex gap-2 mt-3 flex-wrap">
            {form.images.map((img: string, i: number) => (
              <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gold/20" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} id="active" />
          <label htmlFor="active">نشط</label>
        </div>
        <button type="submit" disabled={saving} className="w-full bg-gold text-deepgreen font-bold py-3 rounded-xl hover:bg-gold/90 disabled:opacity-70">
          {saving ? "جارٍ الحفظ…" : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
}
