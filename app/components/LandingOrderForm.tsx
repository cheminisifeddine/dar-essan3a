"use client";

import { useEffect, useState } from "react";
import { buildOrderMessage, getWhatsAppLink } from "../data/products";
import { trackEvent } from "./PixelEvents";
import LocationSelect from "./LocationSelect";

const PRODUCT_NAME = "قبعة القش الطبيعية من دار الصنعة";
const PRODUCT_SLUG = "chapeau-ete";
const PRICE = 2790;
const HOME_FEE = 700;
const STOPDESK_FEE = 500;

function formatDZ(n: number): string {
  return `${new Intl.NumberFormat("en-US").format(n)} دج`;
}

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

function getUtmString(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const parts: string[] = [];
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
    const v = params.get(k);
    if (v) parts.push(`${k}=${v}`);
  });
  return parts.join(" | ");
}

export function LandingOrderForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "stopdesk">("home");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fee = deliveryType === "home" ? HOME_FEE : STOPDESK_FEE;
  const total = PRICE + fee;

  useEffect(() => {
    trackEvent("ViewContent", {
      content_ids: [PRODUCT_SLUG],
      content_name: PRODUCT_NAME,
      content_type: "product",
      value: PRICE,
      currency: "DZD",
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "الرجاء إدخال الاسم واللقب";
    if (!validatePhone(phone)) newErrors.phone = "الرجاء إدخال رقم هاتف جزائري صحيح (10 أرقام)";
    if (!wilaya) newErrors.wilaya = "الرجاء اختيار الولاية";
    if (!city) newErrors.city = "الرجاء اختيار البلدية";
    if (!address.trim()) newErrors.address = "الرجاء إدخال العنوان";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const orderId = generateOrderId();
    const deliveryLabel =
      deliveryType === "home"
        ? `توصيل للدار (${formatDZ(HOME_FEE)})`
        : `التوصيل للمكتب — Stop Desk (${formatDZ(STOPDESK_FEE)})`;
    const items = `${PRODUCT_NAME} × 1`;

    trackEvent("InitiateCheckout", {
      content_ids: [PRODUCT_SLUG],
      content_name: PRODUCT_NAME,
      content_type: "product",
      value: total,
      currency: "DZD",
      num_items: 1,
    });

    const message = buildOrderMessage(
      orderId,
      name,
      cleanPhone(phone),
      wilaya,
      city,
      deliveryLabel,
      items,
      total,
      getUtmString()
    );

    trackEvent("Purchase", {
      content_ids: [PRODUCT_SLUG],
      content_name: PRODUCT_NAME,
      content_type: "product",
      value: total,
      currency: "DZD",
      num_items: 1,
    });

    window.open(getWhatsAppLink(message), "_blank");

    setTimeout(() => setSubmitting(false), 600);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-ivory rounded-2xl p-5 md:p-7 shadow-soft border border-gold/20"
      id="order"
    >
      <h3 className="font-amiri text-2xl md:text-3xl text-deepgreen mb-2 text-center">
        نموذج الطلب
      </h3>
      <p className="text-center text-muted font-tajawal text-sm mb-5">
        الدفع عند الاستلام — افتحي الطرد وتحققي قبل الدفع ✅
      </p>

      <div className="mb-4">
        <label className="block font-tajawal text-sm text-muted mb-1.5">الاسم واللقب *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: فاطمة بن علي"
          className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 font-tajawal text-ink focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-muted/50"
        />
        {errors.name && <p className="text-terracotta text-sm mt-1 font-tajawal">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-tajawal text-sm text-muted mb-1.5">رقم الهاتف *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0550 50 50 50"
          className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 font-tajawal text-ink focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-muted/50"
          dir="ltr"
        />
        {errors.phone && <p className="text-terracotta text-sm mt-1 font-tajawal">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <LocationSelect
          wilaya={wilaya}
          city={city}
          onWilayaChange={setWilaya}
          onCityChange={setCity}
          errors={{ wilaya: errors.wilaya, city: errors.city }}
        />
      </div>

      <div className="mb-4">
        <label className="block font-tajawal text-sm text-muted mb-1.5">العنوان التفصيلي *</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          placeholder="الحي، رقم المنزل، نقطة دالة..."
          className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 font-tajawal text-ink focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-muted/50"
        />
        {errors.address && <p className="text-terracotta text-sm mt-1 font-tajawal">{errors.address}</p>}
      </div>

      <div className="mb-5">
        <label className="block font-tajawal text-sm text-muted mb-2">طريقة التوصيل *</label>
        <div className="space-y-2">
          <label
            className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              deliveryType === "home"
                ? "border-gold bg-gold/10"
                : "border-gold/20 bg-white hover:border-gold/50"
            }`}
          >
            <span className="flex items-center gap-3 font-tajawal text-ink">
              <input
                type="radio"
                name="deliveryType"
                value="home"
                checked={deliveryType === "home"}
                onChange={() => setDeliveryType("home")}
                className="accent-deepgreen"
              />
              🏠 للدار
            </span>
            <span className="font-tajawal font-bold text-deepgreen">+{formatDZ(HOME_FEE)}</span>
          </label>
          <label
            className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              deliveryType === "stopdesk"
                ? "border-gold bg-gold/10"
                : "border-gold/20 bg-white hover:border-gold/50"
            }`}
          >
            <span className="flex items-center gap-3 font-tajawal text-ink">
              <input
                type="radio"
                name="deliveryType"
                value="stopdesk"
                checked={deliveryType === "stopdesk"}
                onChange={() => setDeliveryType("stopdesk")}
                className="accent-deepgreen"
              />
              📦 التوصيل للمكتب (Stop Desk)
            </span>
            <span className="font-tajawal font-bold text-deepgreen">+{formatDZ(STOPDESK_FEE)}</span>
          </label>
        </div>
      </div>

      <div className="bg-deepgreen/5 rounded-xl p-4 mb-5 border border-gold/10">
        <div className="flex justify-between font-tajawal text-muted mb-2">
          <span>القبعة</span>
          <span>{formatDZ(PRICE)}</span>
        </div>
        <div className="flex justify-between font-tajawal text-muted mb-3">
          <span>التوصيل</span>
          <span>{formatDZ(fee)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gold/20">
          <span className="font-tajawal font-bold text-ink">المجموع</span>
          <span className="font-amiri text-3xl text-deepgreen font-bold">{formatDZ(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gold text-deepgreen font-tajawal font-bold text-lg py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft disabled:opacity-70"
      >
        {submitting ? "جارٍ إرسال الطلب…" : "تأكيد الطلب الآن"}
      </button>
      <p className="text-center text-muted text-sm mt-3 font-tajawal">
        بدون مخاطرة — تدفعين عند الاستلام فقط
      </p>
    </form>
  );
}

export default LandingOrderForm;