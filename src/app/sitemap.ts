import type { MetadataRoute } from "next";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  const { promos } = await getContent();
  const fixed = ["", "/thuc-don", "/dat-ban", "/khuyen-mai", "/thu-vien"].map((p) => ({ url: `${base}${p}` }));
  return [...fixed, ...promos.filter((p) => p.published).map((p) => ({ url: `${base}/khuyen-mai/${p.slug}` }))];
}
