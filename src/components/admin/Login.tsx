"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
      return;
    }
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setError(data.error ?? "Không đăng nhập được");
    setBusy(false);
  }

  return (
    <form className="login" onSubmit={onSubmit}>
      <h1>Quản trị Lửa Hồng</h1>
      <label htmlFor="pw">Mật khẩu</label>
      <input id="pw" name="password" type="password" required autoComplete="current-password" />
      <p className="msg err" role="alert">
        {error}
      </p>
      <button className="btn" type="submit" disabled={busy}>
        {busy ? "Đang kiểm tra..." : "Đăng nhập"}
      </button>
    </form>
  );
}
