"use client";

import { useState } from "react";
import {
  Product,
  STORE,
  formatPrice,
} from "../data/products";
import { trackEvent } from "./PixelEvents";
import LocationSelect from "./LocationSelect";

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
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((k) => {
    const v = params.get(k);
    if (v) parts.push(`${k}=${v}`);
  });
  return parts.join(" | ");
}

export function OrderForm({
  initialProduct,
  onSuccess,
}: {
  initialProduct?: Product;
  onSuccess?: () => void;
}) {
  const product = initialProduct!;
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [city, setCity] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "stopdesk">("home");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = product.price * quantity;
  const isFreeShipping = subtotal >= STORE.freeShippingThreshold;
  const shipping = isFreeShipping ? 0 : deliveryType === "home" ? STORE.homeDeliveryFee : STORE.stopDeskFee;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "الرجاء إدخال الاسم الكامل";
    if (!validatePhone(phone)) newErrors.phone = "الرجاء إدخال رقم هاتف جزائري صحيح";
    if (!wilaya) newErrors.wilaya = "الرجاء اختيار الولاية";
    if (!city) newErrors.city = "الرجاء اختيار البلدية";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    trackEvent("InitiateCheckout", {
      content_ids: [product.slug],
      content_name: product.name,
      value: total,
      currency: "DZD",
      num_items: quantity,
    });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone(phone),
          wilaya,
          city,
          address: "",
          deliveryType,
          items: [
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              qty: quantity,
              price: product.price,
            },
          ],
          total,
          shippingFee: shipping,
          utm: getUtmString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);
        setDone(true);
        trackEvent("Purchase", {
          content_ids: [product.slug],
          content_name: product.name,
          value: total,
          currency: "DZD",
          num_items: quantity,
        });
      } else {
        setErrors({ submit: data.error || "حدث خطأ" });
      }
    } catch {
      setErrors({ submit: "تعذر إرسال الطلب. تأكد من الاتصال." });
    } finally {
      setSubmitting(false);
      onSuccess?.();
    }
  }

  if (done) {
    return (
      <div className="bg-ivory rounded-2xl p-5 md:p-7 shadow-soft border border-gold/10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-amiri text-2xl text-deepgreen mb-3">تم استلام طلبك بنجاح</h3>
        <p className="font-tajawal text-muted mb-4">
          شكراً {name}، رقم طلبك: <span className="font-bold text-deepgreen">#{orderId}</span>
        </p>
        <p className="font-tajawal text-muted">سنتصل بك قريباً على الرقم {phone} لتأكيد الطلب.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-ivory rounded-2xl p-5 md:p-7 shadow-soft border border-gold/10">
      <h3 className="font-amiri text-2xl text-deepgreen mb-5 text-center">
        اطلب الآن — الدفع عند الاستلام
      </h3>
      {errors.submit && <p className="text-terracotta text-center mb-4 font-tajawal">{errors.submit}</p>}

      {/* Quantity */}
      <div className="mb-4">
        <label className="block font-tajawal text-sm text-muted mb-1.5">الكمية</label>
        <div className="inline-flex items-center border border-gold/30 rounded-xl bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2 hover:bg-gold/10 text-deepgreen font-bold"
          >
            −
          </button>
          <span className="px-4 py-2 font-tajawal text-ink min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-2 hover:bg-gold/10 text-deepgreen font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block font-tajawal text-sm text-muted mb-1.5">الاسم الكامل *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: فاطمة بن علي"
          className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 font-tajawal text-ink focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-muted/50"
        />
        {errors.name && <p className="text-terracotta text-sm mt-1 font-tajawal">{errors.name}</p>}
      </div>

      {/* Phone */}
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

      {/* Wilaya & City */}
      <div className="mb-4">
        <LocationSelect
          wilaya={wilaya}
          city={city}
          onWilayaChange={setWilaya}
          onCityChange={setCity}
          errors={{ wilaya: errors.wilaya, city: errors.city }}
        />
      </div>

      {/* Delivery type */}
      <div className="mb-4">
        <label className="block font-tajawal text-sm text-muted mb-2">نوع التوصيل *</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gold/20 bg-white cursor-pointer hover:border-gold/50">
            <input
              type="radio"
              name="deliveryType"
              value="home"
              checked={deliveryType === "home"}
              onChange={() => setDeliveryType("home")}
              className="accent-deepgreen"
            />
            <span className="font-tajawal text-ink">توصيل للمنزل {isFreeShipping ? "(مجاني)" : `(${formatPrice(STORE.homeDeliveryFee)})`}</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gold/20 bg-white cursor-pointer hover:border-gold/50">
            <input
              type="radio"
              name="deliveryType"
              value="stopdesk"
              checked={deliveryType === "stopdesk"}
              onChange={() => setDeliveryType("stopdesk")}
              className="accent-deepgreen"
            />
            <span className="font-tajawal text-ink">التوصيل للمكتب — Stop Desk {isFreeShipping ? "(مجاني)" : `(${formatPrice(STORE.stopDeskFee)})`}</span>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-deepgreen/5 rounded-xl p-4 mb-5 border border-gold/10">
        <div className="flex justify-between font-tajawal text-muted mb-2">
          <span>المنتج × {quantity}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-tajawal text-muted mb-3">
          <span>التوصيل</span>
          <span>{isFreeShipping ? "مجاني" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gold/20">
          <span className="font-tajawal font-bold text-ink">المجموع</span>
          <span className="font-amiri text-3xl text-deepgreen font-bold">{formatPrice(total)}</span>
        </div>
        {isFreeShipping && (
          <p className="text-gold font-tajawal text-sm mt-2 text-center">🎉 تهانينا! التوصيل مجاني</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gold text-deepgreen font-tajawal font-bold text-lg py-4 rounded-xl hover:bg-gold/90 transition-colors shadow-soft disabled:opacity-70"
      >
        {submitting ? "جارٍ إرسال الطلب…" : "✅ تأكيد الطلب — الدفع عند الاستلام"}
      </button>
      <p className="text-center text-muted text-sm mt-3 font-tajawal">
        بالضغط على تأكيد، سنتصل بك هاتفياً لتأكيد طلبك قبل الشحن.
      </p>
    </form>
  );
}

export default OrderForm;
