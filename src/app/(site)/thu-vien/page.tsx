import type { Metadata } from "next";
import { Tile } from "@/components/Art";

export const metadata: Metadata = { title: "Thư viện ảnh" };

const ITEMS = [
  { kind: "meat", cap: "Ba chỉ nướng than hoa" },
  { kind: "seafood", cap: "Mực và tôm nướng" },
  { kind: "beer", cap: "Bia hơi lạnh" },
  { kind: "grill", cap: "Vỉ than đỏ rực" },
  { kind: "combo", cap: "Combo cả hội" },
  { kind: "space", cap: "Không gian quán buổi tối" },
  { kind: "meat", cap: "Sườn mật ong" },
  { kind: "seafood", cap: "Hàu nướng mỡ hành" },
] as const;

export default function Gallery() {
  return (
    <section className="s" style={{ paddingTop: 50 }}>
      <div className="wrap">
        <h2>Thư viện ảnh</h2>
        <p className="sub">Hình minh hoạ. Quán sẽ thay bằng ảnh thật của món và không gian.</p>
        <div className="gal">
          {ITEMS.map((it, i) => (
            <figure key={i}>
              <Tile kind={it.kind} />
              <figcaption>{it.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
