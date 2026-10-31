import type { Metadata } from "next";
import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import { CATEGORY_LABEL } from "@/lib/data";
import { vnd } from "@/lib/format";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Thực đơn và đặt món mang về" };
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { menu, combos } = await getContent();
  const cats = ["thit", "haisan", "do-uong"] as const;
  return (
    <section className="s light" style={{ paddingTop: 50 }}>
      <div className="wrap">
        <div className="rowhead">
          <h2>Thực đơn</h2>
          <Link className="btn dark sm" href="/dat-mon">
            Xem giỏ hàng
          </Link>
        </div>
        <p className="sub">Chọn món rồi vào giỏ hàng để đặt mang về. Phí giao hàng và tổng tiền hiện ở bước cuối.</p>

        <h3 className="cat">Combo</h3>
        <div className="menugrid">
          {combos.map((c) => (
            <div className={`mi ${c.available ? "" : "off"}`} key={c.id}>
              <div>
                <h3>{c.name}</h3>
                <p>
                  {c.forWho}. {c.items.join(", ")}.
                </p>
              </div>
              <div className="act">
                <span className="pr">{vnd(c.price)}</span>
                {c.available ? <AddToCart kind="combo" id={c.id} name={c.name} /> : <span>Hết hàng</span>}
              </div>
            </div>
          ))}
        </div>

        {cats.map((cat) => {
          const items = menu.filter((m) => m.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="cat">{CATEGORY_LABEL[cat]}</h3>
              <div className="menugrid">
                {items.map((m) => (
                  <div className={`mi ${m.available ? "" : "off"}`} key={m.id}>
                    <div>
                      <h3>{m.name}</h3>
                      <p>{m.desc}</p>
                    </div>
                    <div className="act">
                      <span className="pr">
                        {vnd(m.price)}
                        <small style={{ fontWeight: 500 }}>/{m.unit}</small>
                      </span>
                      {m.available ? <AddToCart kind="menu" id={m.id} name={m.name} /> : <span>Hết hàng</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
