import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getContent, listBookings, listOrders } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const [bookings, orders, content] = await Promise.all([listBookings(), listOrders(), getContent()]);
  return NextResponse.json({ bookings, orders, content });
}
