import { Store } from "@/lib/db";

function hexToRgbTriplet(hex: string): string {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  if (isNaN(num)) return "0 0 0";
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

export function StoreThemeStyle({ store }: { store?: Partial<Store> | null }) {
  const textColor = store?.text_color || "#241F18";
  const primaryColor = store?.primary_color || "#1E3A2A";
  const secondaryColor = store?.secondary_color || "#C19A3D";
  const bgColor = store?.bg_color || "#F7F2E9";

  const css = `
    :root {
      --color-text: ${textColor};
      --color-primary: ${primaryColor};
      --color-secondary: ${secondaryColor};
      --color-bg: ${bgColor};
      --color-text-rgb: ${hexToRgbTriplet(textColor)};
      --color-primary-rgb: ${hexToRgbTriplet(primaryColor)};
      --color-secondary-rgb: ${hexToRgbTriplet(secondaryColor)};
      --color-bg-rgb: ${hexToRgbTriplet(bgColor)};
      --foreground: ${textColor};
      --background: ${bgColor};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export default StoreThemeStyle;
