import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function find(slug: string) {
  const { promos } = await getContent();
  return promos.find((p) => p.slug === slug && p.published);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await find((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : { title: "Khuyến mãi" };
}

export default async function PromoPage({ params }: Props) {
  const post = await find((await params).slug);
  if (!post) notFound();
  return (
    <section className="s light" style={{ paddingTop: 50 }}>
      <div className="wrap article">
        <p>
          <Link href="/khuyen-mai">← Tất cả khuyến mãi</Link>
        </p>
        <h2 style={{ marginTop: 16 }}>{post.title}</h2>
        <p style={{ opacity: 0.7, marginBottom: 24 }}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        {post.body.split(/\n{2,}/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <p style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn" href="/dat-ban">
            Đặt bàn ngay
          </Link>
          <Link className="btn ghost-dark" href="/thuc-don">
            Xem thực đơn
          </Link>
        </p>
      </div>
    </section>
  );
}
