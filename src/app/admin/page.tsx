import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/Dashboard";
import AdminLogin from "@/components/admin/Login";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const ok = await isAdmin();
  return <div className="admin">{ok ? <AdminDashboard /> : <AdminLogin />}</div>;
}
