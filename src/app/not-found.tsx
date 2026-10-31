import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: "120px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 64 }}>Không tìm thấy trang</h1>
      <p style={{ margin: "16px 0 24px" }}>Trang bạn mở không tồn tại hoặc đã được gỡ.</p>
      <Link className="btn amber" href="/">
        Về trang chủ
      </Link>
    </div>
  );
}
