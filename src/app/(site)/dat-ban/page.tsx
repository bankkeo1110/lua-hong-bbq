import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { SITE } from "@/lib/data";
import { todayVN } from "@/lib/format";

export const metadata: Metadata = { title: "Đặt bàn" };
export const dynamic = "force-dynamic";

export default function BookingPage() {
  return (
    <section className="s light" style={{ paddingTop: 50 }}>
      <div className="wrap">
        <h2>Giữ bàn cho nhóm</h2>
        <p className="sub">
          Điền thông tin, quán gọi lại xác nhận trong ngày. Nhóm trên 20 người hoặc cần gấp, gọi {SITE.branches[0].phone}.
        </p>
        <BookingForm today={todayVN()} />
      </div>
    </section>
  );
}
