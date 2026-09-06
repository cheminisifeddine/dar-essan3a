import type { Metadata } from "next";
import "./globals.css";
import { STORE } from "./data/products";
import PixelEvents from "./components/PixelEvents";

export const metadata: Metadata = {
  title: "دار الصنعة | قوة الطبيعة — منتجات جزائرية مختارة",
  description:
    "منتجات جزائرية مختارة بعناية: وصفات طبيعية ومنتجات أصلية. توصيل لـ 58 ولاية، والدفع عند الاستلام.",
  keywords: ["دار الصنعة", "قوة الطبيعة", "منتجات طبيعية", "منتجات جزائرية", "الجزائر", "COD", "الدفع عند الاستلام"],
  openGraph: {
    title: "دار الصنعة | قوة الطبيعة — منتجات جزائرية مختارة",
    description:
      "منتجات جزائرية مختارة بعناية، توصيل لكل ولايات الوطن، الدفع عند الاستلام.",
    url: `https://${STORE.domain}`,
    type: "website",
    locale: "ar_DZ",
    images: [`https://${STORE.domain}/images/logo.webp`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="theme-color" content="#1E3A2A" />
        <link rel="icon" href="/images/logo.webp" type="image/webp" />
      </head>
      <body className="font-tajawal antialiased min-h-screen bg-cream">
        <PixelEvents />
        {children}
      </body>
    </html>
  );
}
