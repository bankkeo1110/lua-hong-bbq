import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Khuyến mãi" };
export const dynamic = "force-dynamic";

export default async function PromoList() {
  const { promos } = await getContent();
  const posts = promos.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <section className="s light" style={{ paddingTop: 50 }}>
      <div className="wrap">
        <h2>Khuyến mãi</h2>
        <p className="sub">Ưu đãi đang áp dụng tại các chi nhánh.</p>
        {posts.length === 0 ? (
          <p className="empty">Hiện chưa có chương trình khuyến mãi. Bạn quay lại sau nhé.</p>
        ) : (
          <div className="posts">
            {posts.map((p) => (
              <Link className="post" key={p.slug} href={`/khuyen-mai/${p.slug}`}>
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
