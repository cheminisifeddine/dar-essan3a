"use client";

import { useState } from "react";
import { initPixel, trackEvent } from "./PixelEvents";
import { STORE, products, formatPrice } from "../data/products";
import { wilayas, getWilayaName } from "../data/wilayas";

function generateOrderId(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return false;
  return /^0[567]/.test(digits);
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function buildMsg(
  orderId: string,
  name: string,
  phone: string,
  wilaya: string,
  commune: string,
  deliveryType: string,
  prodName: string,
  qty: number,
  total: number
): string {
  return (
    `السلام عليكم،%0Aطلب جديد من دار الصنعة:%0A` +
    `رقم الطلب: #${orderId}%0A` +
    `الاسم: ${name}%0A` +
    `الهاتف: ${phone}%0A` +
    `الولاية: ${wilaya}%0A` +
    `البلدية: ${commune}%0A` +
    `التوصيل: ${deliveryType}%0A` +
    `المنتج: ${prodName} × ${qty}%0A` +
    `المجموع: ${total} دج`
  );
}

export function LandingOrderForm({ productSlug }: { productSlug?: string }) {
  const prod = products.find((p) => p.slug === (productSlug || "chapeau-palmier")) || products[0];
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState("");
  const [commune, setCommune] = useState("");
  const [delivery, setDelivery] = useState<"home" | "stopdesk">("home");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const subtotal = prod.price * qty;
  const isFree = subtotal >= STORE.freeShippingThreshold;
  const shipping = isFree ? 0 : delivery === "home" ? STORE.homeDeliveryFee : STORE.stopDeskFee;
  const total = subtotal + shipping;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "الرجاء إدخال الاسم الكامل";
    if (!validatePhone(phone)) newErrors.phone = "الرجاء إدخال رقم هاتف جزائري صحيح";
    if (!wilayaCode) newErrors.wilaya = "الرجاء اختيار الولاية";
    if (!commune.trim()) newErrors.commune = "الرجاء إدخال البلدية";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});

    initPixel();
    trackEvent("InitiateCheckout", {
      content_ids: [prod.slug],
      content_name: prod.name,
      value: total,
      currency: "DZD",
    });
    trackEvent("Purchase", {
      content_ids: [prod.slug],
      content_name: prod.name,
      value: total,
      currency: "DZD",
    });

    const orderId = generateOrderId();
    const deliveryLabel = delivery === "home" ? `توصيل للمنزل` : `Stop Desk`;
    const msg = buildMsg(orderId, name, cleanPhone(phone), getWilayaName(wilayaCode), commune, deliveryLabel, prod.name, qty, total);
    window.open(`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-ivory rounded-2xl p-6 text-center shadow-soft">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="font-amiri text-2xl text-deepgreen mb-2">تم استلام طلبك</h3>
        <p className="font-tajawal text-muted">شكراً {name}، سنتصل بك قريباً لتأكيد الطلب.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ivory rounded-2xl p-5 shadow-soft border border-gold/10">
      <h3 className="font-amiri text-xl text-deepgreen mb-4 text-center">اطلب الآن — الدفع عند الاستلام</h3>
      <p className="font-tajawal font-bold text-deepgreen text-center mb-4">{prod.name} — {formatPrice(prod.price)}</p>

      <div className="mb-3">
        <label className="block text-sm text-muted mb-1">الكمية</label>
        <div className="inline-flex items-center border border-gold/30 rounded-xl bg-white overflow-hidden">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gold/10 font-bold">−</button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)} className="px-4 py-2 hover:bg-gold/10 font-bold">+</button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm text-muted mb-1">الاسم الكامل *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: فاطمة بن علي" className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-gold/50" />
        {errors.name && <p className="text-terracotta text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-3">
        <label className="block text-sm text-muted mb-1">رقم الهاتف *</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xx xx xx xx" dir="ltr" className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-gold/50" />
        {errors.phone && <p className="text-terracotta text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="mb-3">
        <label className="block text-sm text-muted mb-1">الولاية *</label>
        <select value={wilayaCode} onChange={(e) => setWilayaCode(e.target.value)} className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-gold/50">
          <option value="">اختر الولاية</option>
          {wilayas.map((w) => (
            <option key={w.code} value={w.code}>{w.name} ({w.code})</option>
          ))}
        </select>
        {errors.wilaya && <p className="text-terracotta text-sm mt-1">{errors.wilaya}</p>}
      </div>

      <div className="mb-3">
        <label className="block text-sm text-muted mb-1">البلدية *</label>
        <input type="text" value={commune} onChange={(e) => setCommune(e.target.value)} placeholder="البلدية" className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-gold/50" />
        {errors.commune && <p className="text-terracotta text-sm mt-1">{errors.commune}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm text-muted mb-2">نوع التوصيل *</label>
        <label className="flex items-center gap-3 p-2 rounded-xl border border-gold/20 bg-white cursor-pointer mb-2">
          <input type="radio" name="del" value="home" checked={delivery === "home"} onChange={() => setDelivery("home")} className="accent-deepgreen" />
          <span>توصيل للمنزل {isFree ? "(مجاني)" : `(${formatPrice(STORE.homeDeliveryFee)})`}</span>
        </label>
        <label className="flex items-center gap-3 p-2 rounded-xl border border-gold/20 bg-white cursor-pointer">
          <input type="radio" name="del" value="stopdesk" checked={delivery === "stopdesk"} onChange={() => setDelivery("stopdesk")} className="accent-deepgreen" />
          <span>Stop Desk {isFree ? "(مجاني)" : `(${formatPrice(STORE.stopDeskFee)})`}</span>
        </label>
      </div>

      <div className="bg-deepgreen/5 rounded-xl p-3 mb-4">
        <div className="flex justify-between text-sm text-muted mb-1"><span>المنتج × {qty}</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-sm text-muted mb-2"><span>التوصيل</span><span>{isFree ? "مجاني" : formatPrice(shipping)}</span></div>
        <div className="flex justify-between pt-2 border-t border-gold/20 font-bold"><span>المجموع</span><span className="text-xl text-deepgreen">{formatPrice(total)}</span></div>
        {isFree && <p className="text-gold text-sm mt-1 text-center">🎉 توصيل مجاني!</p>}
      </div>

      <button type="submit" className="w-full bg-gold text-deepgreen font-bold text-lg py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft">✅ تأكيد الطلب — الدفع عند الاستلام</button>
      <p className="text-center text-muted text-xs mt-2">بالضغط على تأكيد، سنتصل بك هاتفياً لتأكيد طلبك قبل الشحن.</p>
    </form>
  );
}

export default LandingOrderForm;
