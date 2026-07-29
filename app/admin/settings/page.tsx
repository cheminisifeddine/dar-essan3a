"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";

const defaultSettings = {
  home_delivery_fee: "500",
  stopdesk_fee: "350",
  free_shipping_threshold: "6000",
  whatsapp_number: "213558522110",
  pixel_id: "1459121952706477",
  store_name: "دار الصنعة",
  hero_title: "من بوسعادة… إلى بيتك",
  hero_subtitle: "قطع تقليدية جزائرية أصيلة، تصنعها أيادي حرفيي بوسعادة — توصيل لكل ولايات الوطن، والدفع عند الاستلام.",
  meta_title: "دار الصنعة — منتجات تقليدية جزائرية أصلية من بوسعادة",
  meta_description: "قطع تقليدية جزائرية أصيلة من بوسعادة: نسيج النخيل، الفخار، النحاس، واللوحات. توصيل لـ 58 ولاية، والدفع عند الاستلام.",
  announcement_bar: "الدفع عند الاستلام 💵 | توصيل لـ 58 ولاية 🚚 | صناعة يدوية 100% من بوسعادة 🤲",
  r2_public_url: "https://pub-ecabff8d21801908882cdb68b6fb1363.r2.dev",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSettings({ ...defaultSettings, ...data.settings });
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) setMessage("تم حفظ الإعدادات");
    else setMessage("حدث خطأ");
  }

  if (loading) return <p>جارٍ التحميل…</p>;

  return (
    <div>
      <h2 className="font-amiri text-3xl text-deepgreen mb-6">الإعدادات</h2>
      {message && <p className="mb-4 text-gold font-bold">{message}</p>}
      <form onSubmit={handleSubmit} className="bg-ivory rounded-xl p-6 shadow-soft border border-gold/10 max-w-3xl space-y-4">
        <h3 className="font-amiri text-xl text-deepgreen">الأسعار والتوصيل</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">توصيل للمنزل</label>
            <input type="number" value={settings.home_delivery_fee} onChange={(e) => setSettings({ ...settings, home_delivery_fee: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">توصيل للمكتب</label>
            <input type="number" value={settings.stopdesk_fee} onChange={(e) => setSettings({ ...settings, stopdesk_fee: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">حد التوصيل المجاني</label>
            <input type="number" value={settings.free_shipping_threshold} onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" />
          </div>
        </div>

        <h3 className="font-amiri text-xl text-deepgreen pt-4">معلومات المتجر</h3>
        <input placeholder="اسم المتجر" value={settings.store_name} onChange={(e) => setSettings({ ...settings, store_name: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" />
        <input placeholder="رقم واتساب" value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" dir="ltr" />
        <input placeholder="Pixel ID" value={settings.pixel_id} onChange={(e) => setSettings({ ...settings, pixel_id: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" dir="ltr" />
        <input placeholder="R2 Public URL" value={settings.r2_public_url} onChange={(e) => setSettings({ ...settings, r2_public_url: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" dir="ltr" />

        <h3 className="font-amiri text-xl text-deepgreen pt-4">الصفحة الرئيسية</h3>
        <input placeholder="عنوان Hero" value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" />
        <textarea placeholder="نص Hero" value={settings.hero_subtitle} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} rows={3} className="w-full border border-gold/30 rounded-xl px-4 py-2" />
        <input placeholder="شريط الإعلانات" value={settings.announcement_bar} onChange={(e) => setSettings({ ...settings, announcement_bar: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" />

        <h3 className="font-amiri text-xl text-deepgreen pt-4">SEO</h3>
        <input placeholder="Meta Title" value={settings.meta_title} onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })} className="w-full border border-gold/30 rounded-xl px-4 py-2" />
        <textarea placeholder="Meta Description" value={settings.meta_description} onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })} rows={3} className="w-full border border-gold/30 rounded-xl px-4 py-2" />

        <button type="submit" disabled={saving} className="w-full bg-gold text-deepgreen font-bold py-3 rounded-xl hover:bg-gold/90 disabled:opacity-70">
          {saving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
        </button>
      </form>
    </div>
  );
}
