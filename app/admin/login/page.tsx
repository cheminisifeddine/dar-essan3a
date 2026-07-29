"use client";
export const runtime = "edge";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "كلمة المرور غير صحيحة");
      }
    } catch {
      setError("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-cream flex items-center justify-center p-4 font-tajawal">
      <form
        onSubmit={handleSubmit}
        className="bg-ivory w-full max-w-md rounded-2xl p-8 shadow-soft border border-gold/10"
      >
        <h1 className="font-amiri text-3xl text-deepgreen mb-2 text-center">دار الصنعة</h1>
        <p className="text-center text-muted mb-6">تسجيل دخول المشرف</p>
        {error && <p className="text-terracotta text-sm mb-4 text-center">{error}</p>}
        <label className="block text-sm text-muted mb-1.5">كلمة المرور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-deepgreen font-bold py-3 rounded-xl hover:bg-gold/90 transition-colors"
        >
          {loading ? "جارٍ الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
