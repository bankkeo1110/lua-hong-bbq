import { NextResponse } from "next/server";
import { addBooking } from "@/lib/store";
import { bookingSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { SITE } from "@/lib/data";
import { todayVN } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`booking:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Bạn gửi quá nhiều lần. Vui lòng thử lại sau ít phút." }, { status: 429 });
  }
  const parsed = bookingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Thông tin chưa hợp lệ" }, { status: 400 });
  }
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot điền ô ẩn: giả vờ thành công
  if (data.date < todayVN()) {
    return NextResponse.json({ error: "Ngày đặt bàn không được ở quá khứ" }, { status: 400 });
  }
  if (!SITE.branches.some((b) => b.name === data.branch)) {
    return NextResponse.json({ error: "Chi nhánh không hợp lệ" }, { status: 400 });
  }
  try {
    const booking = await addBooking(data);
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (e) {
    console.error("addBooking failed", e);
    return NextResponse.json({ error: "Chưa lưu được yêu cầu. Vui lòng gọi hotline để đặt bàn." }, { status: 500 });
  }
}
