import Link from "next/link";
import { SITE } from "@/lib/data";
import CartLink from "./CartLink";

const COLORS = ["#F4B63E", "#ffd98a", "#E5432D", "#fff3c4"];

export function Lights() {
  const bulbs = Array.from({ length: 24 }, (_, i) => {
    const t = i / 24;
    const y = 12 + Math.sin(t * Math.PI * 4) * 10 + (i % 2 ? 10 : 0);
    return <circle key={i} className="bulb" cx={25 + i * 50} cy={y + 14} r={6} fill={COLORS[i % 4]} />;
  });
  return (
    <svg className="lights" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 8 Q 150 58 300 14 T 600 14 T 900 14 T 1200 8" fill="none" stroke="#0a1b1e" strokeWidth="3" />
      <g>{bulbs}</g>
    </svg>
  );
}

export function Header() {
  return (
    <header>
      <Lights />
      <div className="wrap head">
        <Link href="/" className="logo">
          {SITE.name}
        </Link>
        <nav className="nav" aria-label="Menu chính">
          <Link href="/thuc-don">Thực đơn</Link>
          <Link href="/khuyen-mai">Khuyến mãi</Link>
          <Link href="/thu-vien">Thư viện ảnh</Link>
          <Link href="/#chi-nhanh">Chi nhánh</Link>
          <CartLink />
          <Link href="/dat-ban" className="btn amber sm">
            Đặt bàn
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        © {new Date().getFullYear()} {SITE.name} · Mở cửa {SITE.hours} · Hotline {SITE.branches[0].phone}
      </div>
    </footer>
  );
}
