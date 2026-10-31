"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart";
import { vnd } from "@/lib/format";

type Entry = { id: string; name: string; price: number };

export default function Checkout({
  menu,
  combos,
  fee,
  hotline,
}: {
  menu: Entry[];
  combos: Entry[];
  fee: number;
  hotline: string;
}) {
  const { lines, ready, setQty, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { id: string; total: number }>(null);

  const resolved = lines.map((l) => {
    const src = (l.kind === "menu" ? menu : combos).find((x) => x.id === l.id);
    return { ...l, name: src?.name ?? "Món không còn bán", price: src?.price ?? 0, missing: !src };
  });
  const missing = resolved.some((l) => l.missing);
  const subtotal = resolved.reduce((s, l) => s + l.price * l.qty, 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, lines: lines.map(({ kind, id, qty }) => ({ kind, id, qty })) }),
      });
      const data = (await res.json()) as { error?: string; id?: string; total?: number };
      if (!res.ok) throw new Error(data.error ?? "Chưa gửi được đơn");
      setDone({ id: data.id ?? "", total: data.total ?? subtotal + fee });
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chưa gửi được đơn");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="success" role="status">
        <h3>Đã nhận đơn mang về</h3>
        <p>
          Tổng thanh toán {vnd(done.total)}, trả tiền mặt khi nhận hàng. Mã đơn: {done.id.slice(-6).toUpperCase()}. Nhân viên sẽ gọi xác nhận trong ít phút. Cần gấp, gọi {hotline}.
        </p>
        <p style={{ marginTop: 12 }}>
          <Link className="btn amber sm" href="/thuc-don">
            Xem thực đơn
          </Link>
        </p>
      </div>
    );
  }

  if (!ready) return <p className="empty">Đang tải giỏ hàng...</p>;

  if (lines.length === 0) {
    return (
      <div className="empty">
        <p>Giỏ hàng đang trống.</p>
        <p style={{ marginTop: 14 }}>
          <Link className="btn" href="/thuc-don">
            Chọn món
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="cart">
      <div>
        {resolved.map((l) => (
          <div className="line" key={`${l.kind}-${l.id}`}>
            <div>
              <h3>{l.name}</h3>
              {l.missing ? <p className="msg err">Món này không còn bán. Hãy xoá khỏi giỏ.</p> : <p>{vnd(l.price)}</p>}
            </div>
            <div className="qty">
              <button type="button" aria-label={`Giảm số lượng ${l.name}`} onClick={() => setQty(l.kind, l.id, l.qty - 1)}>
                −
              </button>
              <span aria-live="polite">{l.qty}</span>
              <button type="button" aria-label={`Tăng số lượng ${l.name}`} onClick={() => setQty(l.kind, l.id, l.qty + 1)}>
                +
              </button>
            </div>
            <button type="button" className="linkbtn" onClick={() => setQty(l.kind, l.id, 0)}>
              Xoá
            </button>
          </div>
        ))}
      </div>
      <div>
        <div className="sum" style={{ marginBottom: 16 }}>
          <div className="r">
            <span>Tạm tính</span>
            <span>{vnd(subtotal)}</span>
          </div>
          <div className="r">
            <span>Phí giao hàng</span>
            <span>{vnd(fee)}</span>
          </div>
          <div className="r tot">
            <span>Tổng</span>
            <span>{vnd(subtotal + fee)}</span>
          </div>
        </div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label htmlFor="o-name">Họ và tên</label>
            <input id="o-name" name="name" required minLength={2} maxLength={80} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="o-phone">Số điện thoại</label>
            <input id="o-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="o-address">Địa chỉ nhận hàng</label>
            <input id="o-address" name="address" required minLength={8} maxLength={200} autoComplete="street-address" />
          </div>
          <div>
            <label htmlFor="o-note">Ghi chú</label>
            <textarea id="o-note" name="note" maxLength={300} placeholder="Ví dụ: ít cay, giao sau 19:00" />
          </div>
          <div className="hp" aria-hidden="true">
            <label htmlFor="o-web">Website</label>
            <input id="o-web" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <button className="btn" type="submit" disabled={busy || missing}>
            {busy ? "Đang gửi..." : "Gửi đơn, trả tiền khi nhận"}
          </button>
          <p className={`msg ${error ? "err" : ""}`} role="alert">
            {error}
          </p>
        </form>
      </div>
    </div>
  );
}
