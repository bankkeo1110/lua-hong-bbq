import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: "Quán nướng than hoa, bia hơi 15k, combo cho cả nhóm. Đặt bàn và đặt món mang về online tại Đà Nẵng và Hội An.",
  openGraph: { title: SITE.name, description: SITE.tagline, locale: "vi_VN", type: "website" },
};

export const viewport: Viewport = { themeColor: "#0F2A2E" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
