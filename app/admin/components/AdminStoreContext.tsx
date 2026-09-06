"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Store } from "@/lib/db";
import { MAIN_DOMAIN } from "@/lib/store";

type AdminStoreContextValue = {
  stores: Store[];
  /** "all" = every store, otherwise a store subdomain */
  current: string;
  setCurrent: (sub: string) => void;
  currentStore: Store | null;
  loading: boolean;
};

const AdminStoreContext = createContext<AdminStoreContextValue>({
  stores: [],
  current: "all",
  setCurrent: () => {},
  currentStore: null,
  loading: true,
});

const STORAGE_KEY = "admin_store";

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [current, setCurrentState] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCurrentState(saved);
    } catch {}
    fetch("/api/admin/stores")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.stores)) setStores(data.stores);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function setCurrent(sub: string) {
    setCurrentState(sub);
    try {
      localStorage.setItem(STORAGE_KEY, sub);
    } catch {}
  }

  const currentStore =
    current === "all" ? null : stores.find((s) => s.subdomain === current || s.id === current) || null;

  return (
    <AdminStoreContext.Provider value={{ stores, current, setCurrent, currentStore, loading }}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  return useContext(AdminStoreContext);
}

export function storeLabel(subdomain: string, stores: Store[]): string {
  if (!subdomain || subdomain === "main") return "دار الصنعة (الرئيسي)";
  if (subdomain === "all") return "جميع المتاجر";
  const found = stores.find((s) => s.subdomain === subdomain || s.id === subdomain);
  return found ? `${found.name}` : subdomain;
}

export function storeDomain(subdomain: string): string {
  if (!subdomain || subdomain === "main" || subdomain === "all") return MAIN_DOMAIN;
  return `${subdomain}.${MAIN_DOMAIN}`;
}

/** Dropdown to switch the admin view from store to store. Each store gets its full scoped admin. */
export function AdminStoreSwitcher() {
  const { stores, current, setCurrent, loading } = useAdminStore();

  return (
    <div className="px-4 pb-4">
      <label className="block text-xs text-cream/60 mb-1.5 font-medium">المتجر الحالي — بدّل بين المتاجر</label>
      <select
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        disabled={loading}
        className="w-full bg-cream/10 border border-gold/30 text-cream rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold/50 [&>option]:text-ink"
      >
        <option value="all">🌐 جميع المتاجر</option>
        {stores.map((s) => (
          <option key={s.id} value={s.subdomain}>
            {s.subdomain === "main" ? "🏠" : "🏪"} {s.name} ({storeDomain(s.subdomain)})
          </option>
        ))}
      </select>
      {current !== "all" && (
        <p className="text-[11px] text-gold/90 mt-1.5 font-mono" dir="ltr">
          {storeDomain(current)}
        </p>
      )}
    </div>
  );
}
