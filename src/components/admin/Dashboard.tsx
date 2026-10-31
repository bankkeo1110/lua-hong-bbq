"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Booking, Combo, Content, MenuItem, Order, Promo } from "@/lib/types";
import { formatDate, formatDateTime, vnd } from "@/lib/format";

type Tab = "bookings" | "orders" | "menu" | "combos" | "promos";
type Data = { bookings: Booking[]; orders: Order[]; content: Content };

const BOOKING_LABEL: Record<Booking["status"], string> = { moi: "Mới", "xac-nhan": "Đã xác nhận", huy: "Đã huỷ" };
const ORDER_LABEL: Record<Order["status"], string> = { moi: "Mới", "dang-lam": "Đang làm", "hoan-thanh": "Hoàn thành", huy: "Đã huỷ" };

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("bookings");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    if (res.status === 401) return window.location.reload();
    if (!res.ok) return setError("Không tải được dữ liệu");
    setError("");
    setData((await res.json()) as Data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const newBookings = data?.bookings.filter((b) => b.status === "moi").length ?? 0;
  const newOrders = data?.orders.filter((o) => o.status === "moi").length ?? 0;
  const tabs: [Tab, string][] = [
    ["bookings", `Đặt bàn${newBookings ? ` (${newBookings} mới)` : ""}`],
    ["orders", `Đơn mang về${newOrders ? ` (${newOrders} mới)` : ""}`],
    ["menu", "Thực đơn"],
    ["combos", "Combo"],
    ["promos", "Khuyến mãi"],
  ];

  return (
    <div className="wrap" style={{ paddingBottom: 60 }}>
      <div className="atop">
        <h1>Quản trị Lửa Hồng</h1>
        <div className="acts" style={{ marginTop: 0 }}>
          <button className="btn ghost-dark sm" onClick={load}>
            Tải lại
          </button>
          <a className="btn ghost-dark sm" href="/" target="_blank" rel="noreferrer">
            Xem website
          </a>
          <button className="btn dark sm" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </div>
      <div className="tabs" role="tablist">
        {tabs.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>
      {error && <p className="msg err">{error}</p>}
      {!data ? (
        <p>Đang tải...</p>
      ) : tab === "bookings" ? (
        <Bookings rows={data.bookings} reload={load} />
      ) : tab === "orders" ? (
        <Orders rows={data.orders} reload={load} />
      ) : (
        <ContentEditor key={tab} part={tab} initial={data.content} reload={load} />
      )}
    </div>
  );
}

function Bookings({ rows, reload }: { rows: Booking[]; reload: () => void }) {
  const [filter, setFilter] = useState<"all" | Booking["status"]>("all");
  const [day, setDay] = useState("");
  const [err, setErr] = useState("");
  const list = rows.filter((b) => (filter === "all" || b.status === filter) && (!day || b.date === day));

  async function set(id: string, status: Booking["status"]) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setErr("Không cập nhật được");
    else reload();
  }

  return (
    <div>
      <div className="filters">
        <select aria-label="Lọc trạng thái" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(BOOKING_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input aria-label="Lọc theo ngày" type="date" value={day} onChange={(e) => setDay(e.target.value)} />
        {day && (
          <button className="linkbtn" onClick={() => setDay("")}>
            Bỏ lọc ngày
          </button>
        )}
      </div>
      {err && <p className="msg err">{err}</p>}
      {list.length === 0 && <p>Chưa có yêu cầu đặt bàn nào.</p>}
      {list.map((b) => (
        <div className="card" key={b.id}>
          <div className="top">
            <h3>
              {b.name} · {b.guests} người
            </h3>
            <span className={`st ${b.status}`}>{BOOKING_LABEL[b.status]}</span>
          </div>
          <p>
            {b.branch}, {b.time} ngày {formatDate(b.date)} · <a href={`tel:${b.phone}`}>{b.phone}</a>
          </p>
          {b.note && <p>Ghi chú: {b.note}</p>}
          <p style={{ opacity: 0.6, fontSize: 14 }}>Gửi lúc {formatDateTime(b.createdAt)}</p>
          <div className="acts">
            {b.status !== "xac-nhan" && (
              <button className="btn amber sm" onClick={() => set(b.id, "xac-nhan")}>
                Xác nhận
              </button>
            )}
            {b.status !== "huy" && (
              <button className="btn ghost-dark sm" onClick={() => set(b.id, "huy")}>
                Huỷ
              </button>
            )}
            {b.status !== "moi" && (
              <button className="linkbtn" onClick={() => set(b.id, "moi")}>
                Đặt lại thành mới
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Orders({ rows, reload }: { rows: Order[]; reload: () => void }) {
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [err, setErr] = useState("");
  const list = rows.filter((o) => filter === "all" || o.status === filter);

  async function set(id: string, status: Order["status"]) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setErr("Không cập nhật được");
    else reload();
  }

  return (
    <div>
      <div className="filters">
        <select aria-label="Lọc trạng thái" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(ORDER_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {err && <p className="msg err">{err}</p>}
      {list.length === 0 && <p>Chưa có đơn mang về nào.</p>}
      {list.map((o) => (
        <div className="card" key={o.id}>
          <div className="top">
            <h3>
              #{o.id.slice(-6).toUpperCase()} · {o.name} · {vnd(o.total)}
            </h3>
            <span className={`st ${o.status}`}>{ORDER_LABEL[o.status]}</span>
          </div>
          <p>
            <a href={`tel:${o.phone}`}>{o.phone}</a> · {o.address}
          </p>
          <ul style={{ margin: "6px 0 6px 20px" }}>
            {o.lines.map((l) => (
              <li key={`${l.kind}-${l.id}`}>
                {l.qty} × {l.name} ({vnd(l.price)})
              </li>
            ))}
          </ul>
          <p>Phí giao hàng {vnd(o.fee)}. Thu tiền mặt khi giao.</p>
          {o.note && <p>Ghi chú: {o.note}</p>}
          <p style={{ opacity: 0.6, fontSize: 14 }}>Gửi lúc {formatDateTime(o.createdAt)}</p>
          <div className="acts">
            {o.status === "moi" && (
              <button className="btn amber sm" onClick={() => set(o.id, "dang-lam")}>
                Nhận đơn
              </button>
            )}
            {o.status === "dang-lam" && (
              <button className="btn amber sm" onClick={() => set(o.id, "hoan-thanh")}>
                Hoàn thành
              </button>
            )}
            {o.status !== "huy" && o.status !== "hoan-thanh" && (
              <button className="btn ghost-dark sm" onClick={() => set(o.id, "huy")}>
                Huỷ
              </button>
            )}
            {(o.status === "huy" || o.status === "hoan-thanh") && (
              <button className="linkbtn" onClick={() => set(o.id, "moi")}>
                Đặt lại thành mới
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || `muc-${Date.now().toString(36)}`;

function ContentEditor({ part, initial, reload }: { part: "menu" | "combos" | "promos"; initial: Content; reload: () => void }) {
  const [content, setContent] = useState<Content>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(initial), [content, initial]);

  function patch<K extends "menu" | "combos" | "promos">(key: K, i: number, change: Partial<Content[K][number]>) {
    setContent((c) => ({ ...c, [key]: (c[key] as object[]).map((row, idx) => (idx === i ? { ...row, ...change } : row)) }));
  }
  function remove(key: "menu" | "combos" | "promos", i: number) {
    setContent((c) => ({ ...c, [key]: (c[key] as object[]).filter((_, idx) => idx !== i) }));
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: body.error ?? "Chưa lưu được" });
    setMsg({ ok: true, text: "Đã lưu. Website cập nhật ngay." });
    reload();
  }

  return (
    <div className="ed">
      {part === "menu" && (
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Tên món</th><th>Nhóm</th><th>Mô tả</th><th>Giá (đ)</th><th>Đơn vị</th><th>Còn bán</th><th />
              </tr>
            </thead>
            <tbody>
              {content.menu.map((m, i) => (
                <tr key={m.id}>
                  <td><input aria-label="Tên món" value={m.name} onChange={(e) => patch("menu", i, { name: e.target.value })} /></td>
                  <td>
                    <select aria-label="Nhóm" value={m.category} onChange={(e) => patch("menu", i, { category: e.target.value as MenuItem["category"] })}>
                      <option value="thit">Thịt nướng</option>
                      <option value="haisan">Hải sản, đồ nhắm</option>
                      <option value="do-uong">Đồ uống</option>
                    </select>
                  </td>
                  <td><input aria-label="Mô tả" value={m.desc} onChange={(e) => patch("menu", i, { desc: e.target.value })} /></td>
                  <td className="n"><input aria-label="Giá" type="number" min={0} step={1000} value={m.price} onChange={(e) => patch("menu", i, { price: Math.max(0, Math.round(Number(e.target.value) || 0)) })} /></td>
                  <td className="n"><input aria-label="Đơn vị" value={m.unit} onChange={(e) => patch("menu", i, { unit: e.target.value })} /></td>
                  <td className="c"><input aria-label="Còn bán" type="checkbox" checked={m.available} onChange={(e) => patch("menu", i, { available: e.target.checked })} /></td>
                  <td><button className="linkbtn" onClick={() => remove("menu", i)}>Xoá</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn amber sm"
            style={{ marginTop: 12 }}
            onClick={() =>
              setContent((c) => ({
                ...c,
                menu: [...c.menu, { id: `mon-${Date.now().toString(36)}`, category: "thit", name: "Món mới", desc: "", price: 50000, unit: "đĩa", available: true }],
              }))
            }
          >
            Thêm món
          </button>
        </div>
      )}

      {part === "combos" && (
        <div>
          {content.combos.map((c, i) => (
            <div className="card" key={c.id}>
              <div className="form" style={{ maxWidth: "none" }}>
                <div><label>Tên combo</label><input value={c.name} onChange={(e) => patch("combos", i, { name: e.target.value })} /></div>
                <div><label>Dành cho</label><input value={c.forWho} onChange={(e) => patch("combos", i, { forWho: e.target.value })} /></div>
                <div><label>Giá (đ)</label><input type="number" min={0} step={1000} value={c.price} onChange={(e) => patch("combos", i, { price: Math.max(0, Math.round(Number(e.target.value) || 0)) })} /></div>
                <div>
                  <label>Hiển thị</label>
                  <label style={{ fontWeight: 500 }}><input style={{ width: "auto" }} type="checkbox" checked={c.available} onChange={(e) => patch("combos", i, { available: e.target.checked })} /> Còn bán</label>
                  <label style={{ fontWeight: 500 }}><input style={{ width: "auto" }} type="checkbox" checked={c.featured} onChange={(e) => patch("combos", i, { featured: e.target.checked })} /> Nổi bật (được gọi nhiều nhất)</label>
                </div>
                <div className="full">
                  <label>Các món trong combo (mỗi dòng một món)</label>
                  <textarea value={c.items.join("\n")} onChange={(e) => patch("combos", i, { items: e.target.value.split("\n").filter((x) => x.trim() !== "") })} />
                </div>
              </div>
              <div className="acts"><button className="linkbtn" onClick={() => remove("combos", i)}>Xoá combo</button></div>
            </div>
          ))}
          <button
            className="btn amber sm"
            onClick={() =>
              setContent((c) => ({
                ...c,
                combos: [...c.combos, { id: `combo-${Date.now().toString(36)}`, name: "Combo mới", forWho: "2 – 3 người", items: [], price: 300000, featured: false, available: true }],
              }))
            }
          >
            Thêm combo
          </button>
        </div>
      )}

      {part === "promos" && (
        <div>
          {content.promos.map((p, i) => (
            <div className="card" key={p.slug + i}>
              <div className="form" style={{ maxWidth: "none" }}>
                <div className="full"><label>Tiêu đề</label><input value={p.title} onChange={(e) => patch("promos", i, { title: e.target.value })} /></div>
                <div><label>Đường dẫn (slug)</label><input value={p.slug} onChange={(e) => patch("promos", i, { slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} /></div>
                <div><label>Ngày đăng</label><input type="date" value={p.date} onChange={(e) => patch("promos", i, { date: e.target.value })} /></div>
                <div className="full"><label>Mô tả ngắn</label><input value={p.excerpt} onChange={(e) => patch("promos", i, { excerpt: e.target.value })} /></div>
                <div className="full"><label>Nội dung (cách một dòng trống để xuống đoạn)</label><textarea style={{ minHeight: 160 }} value={p.body} onChange={(e) => patch("promos", i, { body: e.target.value })} /></div>
                <div className="full"><label style={{ fontWeight: 500 }}><input style={{ width: "auto" }} type="checkbox" checked={p.published} onChange={(e) => patch("promos", i, { published: e.target.checked })} /> Đang hiển thị trên website</label></div>
              </div>
              <div className="acts"><button className="linkbtn" onClick={() => remove("promos", i)}>Xoá bài</button></div>
            </div>
          ))}
          <button
            className="btn amber sm"
            onClick={() =>
              setContent((c) => {
                const title = "Khuyến mãi mới";
                return {
                  ...c,
                  promos: [{ slug: `${slugify(title)}-${Date.now().toString(36)}`, title, excerpt: "", body: "", date: new Date().toLocaleDateString("sv-SE"), published: false }, ...c.promos],
                };
              })
            }
          >
            Thêm bài khuyến mãi
          </button>
        </div>
      )}

      <div className="savebar">
        <button className="btn" onClick={save} disabled={busy || !dirty}>
          {busy ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        {dirty && <span>Có thay đổi chưa lưu</span>}
        {msg && <span className={`msg ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</span>}
      </div>
    </div>
  );
}
