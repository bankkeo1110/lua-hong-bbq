import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateBooking } from "@/lib/store";

export const dynamic = "force-dynamic";
const OK = ["moi", "xac-nhan", "huy"] as const;

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const { id } = await ctx.params;
  if (!/^[a-z0-9-]+$/.test(id)) return NextResponse.json({ error: "Mã không hợp lệ" }, { status: 400 });
  const body = (await req.json().catch(() => null)) as { status?: string } | null;
  const status = OK.find((s) => s === body?.status);
  if (!status) return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  const updated = await updateBooking(id, status);
  if (!updated) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(updated);
}
