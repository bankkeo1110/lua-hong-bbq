export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

export const shortVnd = (n: number) =>
  n % 1000 === 0 && n < 1_000_000 ? `${n / 1000}k` : vnd(n);

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export const todayVN = () =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
