"use client";

import { useState, useEffect } from "react";
import { locations, getCitiesByWilaya } from "../data/locations";

type LocationSelectProps = {
  wilaya: string;
  city: string;
  onWilayaChange: (wilaya: string) => void;
  onCityChange: (city: string) => void;
  errors?: { wilaya?: string; city?: string };
};

export function LocationSelect({
  wilaya,
  city,
  onWilayaChange,
  onCityChange,
  errors,
}: LocationSelectProps) {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const list = getCitiesByWilaya(wilaya);
    setCities(list);
    if (list.length > 0 && !list.includes(city)) {
      onCityChange(list[0]);
    }
  }, [wilaya, city, onCityChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-tajawal text-sm text-muted mb-1.5">الولاية *</label>
        <select
          value={wilaya}
          onChange={(e) => {
            const selectedWilaya = e.target.value;
            onWilayaChange(selectedWilaya);
            const firstCity = getCitiesByWilaya(selectedWilaya)[0] || "";
            onCityChange(firstCity);
          }}
          className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 font-tajawal text-ink focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <option value="">اختر الولاية</option>
          {locations.map((w) => (
            <option key={w.stateCode} value={w.state}>
              {w.stateCode} — {w.state}
            </option>
          ))}
        </select>
        {errors?.wilaya && <p className="text-terracotta text-sm mt-1 font-tajawal">{errors.wilaya}</p>}
      </div>

      <div>
        <label className="block font-tajawal text-sm text-muted mb-1.5">البلدية *</label>
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={cities.length === 0}
          className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 font-tajawal text-ink focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:bg-gray-100 disabled:text-muted"
        >
          <option value="">{cities.length === 0 ? "اختر الولاية أولاً" : "اختر البلدية"}</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors?.city && <p className="text-terracotta text-sm mt-1 font-tajawal">{errors.city}</p>}
      </div>
    </div>
  );
}

export default LocationSelect;
