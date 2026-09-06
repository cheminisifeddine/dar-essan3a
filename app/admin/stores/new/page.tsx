"use client";
export const runtime = "edge";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MAIN_DOMAIN } from "@/lib/store";

const COLOR_PRESETS = [
  {
    name: "التراث الجزائري (دار الصنعة)",
    text: "#241F18",
    primary: "#1E3A2A",
    secondary: "#C19A3D",
    bg: "#F7F2E9",
  },
  {
    name: "صحة وعافية (Santé & Nature)",
    text: "#12372A",
    primary: "#004225",
    secondary: "#43766C",
    bg: "#F5FAF5",
  },
  {
    name: "أزرق ملكي بحري (Royal Ocean)",
    text: "#0F172A",
    primary: "#1E3A8A",
    secondary: "#0284C7",
    bg: "#F0F9FF",
  },
  {
    name: "أحمر عنابي وتوابل (Spice & Terracotta)",
    text: "#2D1810",
    primary: "#8B263E",
    secondary: "#D97706",
    bg: "#FFFBEB",
  },
  {
    name: "بنفسجي فاخر (Luxury Amethyst)",
    text: "#24102F",
    primary: "#4C1D95",
    secondary: "#D97706",
    bg: "#FAF5FF",
  },
];

export default function NewStorePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    subdomain: "",
    text_color: "#12372A",
    primary_color: "#004225",
    secondary_color: "#43766C",
    bg_color: "#F5FAF5",
    hero_title: "",
    hero_subtitle: "",
    announcement_bar: "توصيل لـ 58 ولاية 🚚 | الدفع عند الاستلام 💵 | جودة مضمونة 100% ⭐",
    description: "",
    whatsapp_number: "213558522110",
    pixel_id: "1459121952706477",
    home_delivery_fee: "500",
    stopdesk_fee: "350",
    free_shipping_threshold: "6000",
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto clean subdomain
  function handleSubdomainChange(val: string) {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, subdomain: clean }));
  }

  function applyPreset(preset: typeof COLOR_PRESETS[0]) {
    setForm((f) => ({
      ...f,
      text_color: preset.text,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      bg_color: preset.bg,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSaving(false);

      if (data.success) {
        router.push("/admin/stores");
      } else {
        setError(data.error || "تعذر إنشاء المتجر");
      }
    } catch (err: any) {
      setSaving(false);
      setError("خطأ في الاتصال بالسيرفر");
    }
  }

  const previewSubdomain = form.subdomain ? `${form.subdomain}.${MAIN_DOMAIN}` : `[subdomain].${MAIN_DOMAIN}`;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-amiri text-3xl text-deepgreen">إنشاء متجر جديد</h2>
          <p className="text-sm text-muted">
            خصص اسم المتجر، النطاق الفرعي، وألوان النصوص والهوية البصرية الفريدة
          </p>
        </div>
        <Link href="/admin/stores" className="text-sm text-muted hover:text-deepgreen">
          ← العودة للمتاجر
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-tajawal">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Name and Subdomain */}
        <div className="bg-ivory rounded-2xl p-6 shadow-soft border border-gold/15 space-y-4">
          <h3 className="font-amiri text-xl text-deepgreen font-bold">1. معلومات المتجر والنطاق الفرعي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1 font-medium">اسم المتجر *</label>
              <input
                placeholder="مثال: متجر الصحة والعافية (Santé)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1 font-medium">
                النطاق الفرعي (Subdomain) *
              </label>
              <div className="flex items-center" dir="ltr">
                <input
                  placeholder="sante"
                  value={form.subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  className="w-full border border-gold/30 rounded-l-xl px-4 py-2.5 bg-white font-mono text-sm"
                  required
                />
                <span className="bg-gray-100 border border-l-0 border-gold/30 rounded-r-xl px-3 py-2.5 text-xs text-muted font-mono whitespace-nowrap">
                  .{MAIN_DOMAIN}
                </span>
              </div>
              <p className="text-xs text-muted mt-1" dir="rtl">
                سيكون الرابط المباشر:{" "}
                <span className="font-mono text-deepgreen font-bold" dir="ltr">
                  https://{previewSubdomain}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Colors and Live Visual Styling */}
        <div className="bg-ivory rounded-2xl p-6 shadow-soft border border-gold/15 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-amiri text-xl text-deepgreen font-bold">2. تخصيص ألوان النصوص والهوية البصرية</h3>
            <span className="text-xs text-muted">اختر قالباً جاهزاً أو نسّق ألوانك الخاصة</span>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs text-muted mb-2 font-medium">نماذج ألوان مقترحة:</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.text }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Unique Text Color */}
            <div className="bg-white p-3.5 rounded-xl border border-gold/20 shadow-sm">
              <label className="block text-xs font-bold text-ink mb-1">
                لون النص الفريد (Text Color)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.text_color}
                  onChange={(e) => setForm({ ...form, text_color: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={form.text_color}
                  onChange={(e) => setForm({ ...form, text_color: e.target.value })}
                  className="w-full font-mono text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                  dir="ltr"
                />
              </div>
              <p className="text-[11px] text-muted mt-1.5">لون العناوين، الأوصاف، والنصوص الأساسية</p>
            </div>

            {/* Primary Color */}
            <div className="bg-white p-3.5 rounded-xl border border-gold/20 shadow-sm">
              <label className="block text-xs font-bold text-ink mb-1">اللون الأساسي (Primary)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  className="w-full font-mono text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                  dir="ltr"
                />
              </div>
              <p className="text-[11px] text-muted mt-1.5">شريط الرأس، الأزرار، والفوتر</p>
            </div>

            {/* Secondary Color */}
            <div className="bg-white p-3.5 rounded-xl border border-gold/20 shadow-sm">
              <label className="block text-xs font-bold text-ink mb-1">اللون المميّز (Accent)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.secondary_color}
                  onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={form.secondary_color}
                  onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                  className="w-full font-mono text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                  dir="ltr"
                />
              </div>
              <p className="text-[11px] text-muted mt-1.5">شارات الخصم، الزخارف، ونقاط القوة</p>
            </div>

            {/* Background Color */}
            <div className="bg-white p-3.5 rounded-xl border border-gold/20 shadow-sm">
              <label className="block text-xs font-bold text-ink mb-1">لون الخلفية (Background)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.bg_color}
                  onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={form.bg_color}
                  onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                  className="w-full font-mono text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                  dir="ltr"
                />
              </div>
              <p className="text-[11px] text-muted mt-1.5">خلفية صفحات المتجر والبطاقات</p>
            </div>
          </div>

          {/* Interactive Live Preview */}
          <div className="pt-3">
            <label className="block text-xs font-bold text-deepgreen mb-2">
              ⚡ معاينة فورية لشكل المتجر بألوانك المختارة:
            </label>
            <div
              className="rounded-2xl p-6 border shadow-md transition-all duration-300"
              style={{
                backgroundColor: form.bg_color,
                borderColor: `${form.secondary_color}40`,
                color: form.text_color,
              }}
            >
              {/* Mock Header */}
              <div
                className="flex items-center justify-between pb-4 mb-4 border-b"
                style={{ borderColor: `${form.secondary_color}30` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                    style={{ backgroundColor: form.primary_color }}
                  >
                    ★
                  </span>
                  <div>
                    <h4 className="font-amiri text-lg font-bold" style={{ color: form.primary_color }}>
                      {form.name || "اسم متجرك الفرعي"}
                    </h4>
                    <span className="font-mono text-[10px] opacity-75" dir="ltr">
                      {previewSubdomain}
                    </span>
                  </div>
                </div>
                <span
                  className="text-xs px-3 py-1 rounded-full text-white font-medium"
                  style={{ backgroundColor: form.secondary_color }}
                >
                  طلب سريع
                </span>
              </div>

              {/* Mock Hero content */}
              <div className="text-center py-4 space-y-2">
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white mb-2"
                  style={{ backgroundColor: form.primary_color }}
                >
                  منتجات أصلية 100%
                </span>
                <h3
                  className="font-amiri text-2xl font-bold"
                  style={{ color: form.text_color }}
                >
                  {form.hero_title || "عنوان المتجر الجذاب يظهر بلون النص المختار"}
                </h3>
                <p
                  className="text-sm max-w-md mx-auto"
                  style={{ color: form.text_color, opacity: 0.85 }}
                >
                  {form.hero_subtitle || "وصف المتجر والمنتجات يظهر بالهوية اللونية الخاصة بالمتجر."}
                </p>

                <div className="pt-3">
                  <button
                    type="button"
                    className="px-6 py-2 rounded-xl font-bold text-white shadow-sm hover:opacity-90"
                    style={{ backgroundColor: form.primary_color }}
                  >
                    تسوّق الآن — الدفع عند الاستلام
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Content and Hero */}
        <div className="bg-ivory rounded-2xl p-6 shadow-soft border border-gold/15 space-y-4">
          <h3 className="font-amiri text-xl text-deepgreen font-bold">3. نصوص الصفحة الرئيسية والتواصل</h3>
          <div>
            <label className="block text-sm text-muted mb-1">عنوان Hero الرئيسي</label>
            <input
              placeholder="مثال: أصالة الطبيعة لصحتك وعافيتك"
              value={form.hero_title}
              onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
              className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">نص Hero الفرعي</label>
            <textarea
              placeholder="وصف مختصر للمتجر ورسالته للزبائن..."
              value={form.hero_subtitle}
              onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
              rows={2}
              className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">شريط الإعلانات العلوي</label>
            <input
              placeholder="توصيل لـ 58 ولاية 🚚 | الدفع عند الاستلام 💵"
              value={form.announcement_bar}
              onChange={(e) => setForm({ ...form, announcement_bar: e.target.value })}
              className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">رقم واتساب للتواصل والطلبات</label>
              <input
                placeholder="213558522110"
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Pixel ID (Meta)</label>
              <input
                placeholder="1459121952706477"
                value={form.pixel_id}
                onChange={(e) => setForm({ ...form, pixel_id: e.target.value })}
                className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Delivery fees */}
        <div className="bg-ivory rounded-2xl p-6 shadow-soft border border-gold/15 space-y-4">
          <h3 className="font-amiri text-xl text-deepgreen font-bold">4. رسوم التوصيل الخاصة بالمتجر</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">توصيل للمنزل (دج)</label>
              <input
                type="number"
                value={form.home_delivery_fee}
                onChange={(e) => setForm({ ...form, home_delivery_fee: e.target.value })}
                className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">توصيل للمكتب / Stopdesk (دج)</label>
              <input
                type="number"
                value={form.stopdesk_fee}
                onChange={(e) => setForm({ ...form, stopdesk_fee: e.target.value })}
                className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">حد التوصيل المجاني (دج)</label>
              <input
                type="number"
                value={form.free_shipping_threshold}
                onChange={(e) => setForm({ ...form, free_shipping_threshold: e.target.value })}
                className="w-full border border-gold/30 rounded-xl px-4 py-2.5 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 rounded text-deepgreen"
            />
            <label htmlFor="active" className="text-sm font-medium">تفعيل المتجر ونشره فوراً</label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gold text-deepgreen font-bold text-lg py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft disabled:opacity-70"
        >
          {saving ? "جارٍ إنشاء المتجر…" : "حفظ وإنشاء المتجر"}
        </button>
      </form>
    </div>
  );
}
