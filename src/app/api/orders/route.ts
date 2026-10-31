import { NextResponse } from "next/server";
import { addOrder, getContent } from "@/lib/store";
import { orderSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { SITE } from "@/lib/data";
import type { OrderLine } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`order:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Bạn gửi quá nhiều lần. Vui lòng thử lại sau ít phút." }, { status: 429 });
  }
  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Thông tin chưa hợp lệ" }, { status: 400 });
  }
  const { website, lines, ...contact } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  // Giá luôn lấy từ máy chủ, không tin giá do trình duyệt gửi lên.
  const content = await getContent();
  const resolved: OrderLine[] = [];
  for (const l of lines) {
    const found =
      l.kind === "menu"
        ? content.menu.find((m) => m.id === l.id && m.available)
        : content.combos.find((c) => c.id === l.id && c.available);
    if (!found) {
      return NextResponse.json({ error: "Có món vừa hết hoặc không còn bán. Vui lòng kiểm tra lại giỏ hàng." }, { status: 409 });
    }
    resolved.push({ kind: l.kind, id: l.id, name: found.name, price: found.price, qty: l.qty });
  }
  const subtotal = resolved.reduce((s, l) => s + l.price * l.qty, 0);
  try {
    const order = await addOrder({
      ...contact,
      lines: resolved,
      fee: SITE.deliveryFee,
      total: subtotal + SITE.deliveryFee,
    });
    return NextResponse.json({ ok: true, id: order.id, total: order.total });
  } catch (e) {
    console.error("addOrder failed", e);
    return NextResponse.json({ error: "Chưa lưu được đơn. Vui lòng gọi hotline để đặt món." }, { status: 500 });
  }
}
