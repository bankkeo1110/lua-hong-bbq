"use client";
import { useState } from "react";
import { SITE } from "@/lib/data";
import { formatDate } from "@/lib/format";

const TIMES = Array.from({ length: 16 }, (_, i) => {
  const mins = 16 * 60 + i * 30;
  return `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

export default function BookingForm({ today }: { today: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { name: string; branch: string; date: string; time: string; guests: number }>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Chưa gửi được yêu cầu");
      setDone({
        name: String(body.name),
        branch: String(body.branch),
        date: String(body.date),
        time: String(body.time),
        guests: Number(body.guests),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chưa gửi được yêu cầu");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    const phone = SITE.branches.find((b) => b.name === done.branch)?.phone ?? SITE.branches[0].phone;
    return (
      <div className="success" role="status">
        <h3>Đã nhận yêu cầu đặt bàn</h3>
        <p>
          Cảm ơn {done.name}. Quán giữ bàn cho {done.guests} người tại {done.branch}, lúc {done.time} ngày {formatDate(done.date)}. Nhân viên sẽ gọi lại để xác nhận trong ngày. Cần gấp, gọi {phone}.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <div>
        <label htmlFor="bk-name">Họ và tên</label>
        <input id="bk-name" name="name" required minLength={2} maxLength={80} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="bk-phone">Số điện thoại</label>
        <input id="bk-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" />
      </div>
      <div>
        <label htmlFor="bk-branch">Chi nhánh</label>
        <select id="bk-branch" name="branch" defaultValue={SITE.branches[0].name}>
          {SITE.branches.map((b) => (
            <option key={b.name}>{b.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="bk-guests">Số người</label>
        <input id="bk-guests" name="guests" type="number" min={1} max={60} defaultValue={6} required />
      </div>
      <div>
        <label htmlFor="bk-date">Ngày</label>
        <input id="bk-date" name="date" type="date" min={today} defaultValue={today} required />
      </div>
      <div>
        <label htmlFor="bk-time">Giờ</label>
        <select id="bk-time" name="time" defaultValue="19:00">
          {TIMES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="full">
        <label htmlFor="bk-note">Ghi chú (không bắt buộc)</label>
        <textarea id="bk-note" name="note" maxLength={300} placeholder="Ví dụ: sinh nhật, cần ghế trẻ em, ngồi ngoài trời" />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="bk-web">Website</label>
        <input id="bk-web" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="full">
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Đang gửi..." : "Gửi yêu cầu giữ bàn"}
        </button>
        <p className={`msg ${error ? "err" : ""}`} role="alert">
          {error}
        </p>
      </div>
    </form>
  );
}
