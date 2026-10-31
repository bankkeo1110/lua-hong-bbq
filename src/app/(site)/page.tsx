import Link from "next/link";
import { TableArt, Tile } from "@/components/Art";
import AddToCart from "@/components/AddToCart";
import BookingForm from "@/components/BookingForm";
import { CATEGORY_LABEL, SITE } from "@/lib/data";
import { formatDate, shortVnd, todayVN, vnd } from "@/lib/format";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { menu, combos, promos } = await getContent();
  const posts = promos.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
  const shown = menu.filter((m) => m.category !== "do-uong");
  const drinks = menu.filter((m) => m.category === "do-uong");
  const left = shown.filter((m) => m.category === "thit");
  const right = shown.filter((m) => m.category === "haisan");
  const liveCombos = combos.filter((c) => c.available);
  const ticker = [...posts.map((p) => p.title), `Mở cửa ${SITE.hours}`].join("  ·  ");

  const row = (m: (typeof menu)[number]) => (
    <div className={`it ${m.available ? "" : "off"}`} key={m.id}>
      {m.name}
      <i />
      <b>
        {shortVnd(m.price)}
        {m.unit && m.unit !== "đĩa" ? `/${m.unit}` : ""}
      </b>
    </div>
  );

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>
              Tối nay <em>nướng</em> nhé?
            </h1>
            <p>Than hoa đỏ rực, bia lạnh, ghế nhựa và cả nhóm ngồi quanh một vỉ thịt.</p>
            <div className="btns">
              <Link className="btn" href="/thuc-don">
                Đặt món mang về
              </Link>
              <Link className="btn out" href="/dat-ban">
                Giữ bàn cho nhóm
              </Link>
            </div>
          </div>
          <div className="art">
            <TableArt />
          </div>
        </div>
      </section>
      <div className="bar" aria-hidden="true">
        <div>{ticker}  ·  </div>
      </div>

      <section className="s" id="thuc-don">
        <div className="wrap">
          <h2>Bảng thực đơn hôm nay</h2>
          <p className="sub">Gọi theo đĩa, nướng tại bàn. Giá đã gồm rau sống và nước chấm.</p>
          <div className="board">
            <div className="cols">
              <div>
                <h3>{CATEGORY_LABEL.thit}</h3>
                {left.map(row)}
              </div>
              <div>
                <h3>{CATEGORY_LABEL.haisan}</h3>
                {right.map(row)}
              </div>
            </div>
            {drinks.length > 0 && (
              <>
                <div className="chalkline" />
                <div className="cols">{drinks.slice(0, 2).map(row)}</div>
              </>
            )}
            <div className="boardfoot">
              <span style={{ fontFamily: "Patrick Hand, cursive", fontSize: 20, opacity: 0.8 }}>
                Món gạch ngang là hôm nay hết hàng
              </span>
              <Link className="btn amber sm" href="/thuc-don">
                Xem đủ thực đơn và đặt món
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="s" id="combo" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>Combo cả nhóm</h2>
          <p className="sub">Không biết gọi gì thì chọn combo. Đủ thịt, đủ rau, đủ no.</p>
          <div className="sets">
            {liveCombos.map((c) => (
              <article className={`set ${c.featured ? "hot" : ""}`} key={c.id}>
                {c.featured && <span className="tag">Được gọi nhiều nhất</span>}
                <h3>{c.name}</h3>
                <p className="for">{c.forWho}</p>
                <ul>
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <div className="pr">{vnd(c.price)}</div>
                <AddToCart kind="combo" id={c.id} name={c.name} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="s light">
          <div className="wrap">
            <div className="rowhead">
              <h2>Khuyến mãi đang chạy</h2>
              <Link className="btn dark sm" href="/khuyen-mai">
                Xem tất cả
              </Link>
            </div>
            <div className="posts" style={{ marginTop: 20 }}>
              {posts.slice(0, 2).map((p) => (
                <Link className="post" key={p.slug} href={`/khuyen-mai/${p.slug}`}>
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="s">
        <div className="wrap">
          <div className="rowhead">
            <h2>Món ngon và không gian quán</h2>
            <Link className="btn out sm" href="/thu-vien">
              Thư viện ảnh
            </Link>
          </div>
          <div className="gal" style={{ marginTop: 20 }}>
            <figure><Tile kind="meat" /><figcaption>Ba chỉ than hoa</figcaption></figure>
            <figure><Tile kind="seafood" /><figcaption>Hải sản nướng</figcaption></figure>
            <figure><Tile kind="beer" /><figcaption>Bia hơi lạnh</figcaption></figure>
            <figure><Tile kind="grill" /><figcaption>Than hoa đỏ</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="s light">
        <div className="wrap">
          <h2>Khách quen kể</h2>
          <div className="rv" style={{ marginTop: 24 }}>
            {SITE.reviews.map((r) => (
              <div key={r.name}>
                {r.text}
                <b>{r.name}</b>
              </div>
            ))}
          </div>
          <p style={{ margin: "34px 0 10px", fontWeight: 800 }}>Gọi nướng về nhà qua ứng dụng:</p>
          <div className="partners">
            {SITE.partners.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="s" id="chi-nhanh">
        <div className="wrap">
          <h2>Tìm quán gần bạn</h2>
          <p className="sub">Mở cửa {SITE.hours}.</p>
          <div className="brs">
            {SITE.branches.map((b) => (
              <div className="br" key={b.name}>
                <h3>{b.name}</h3>
                <p>
                  {b.address}
                  <br />
                  {b.note}
                </p>
                <div className="t">
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s light" id="dat-ban">
        <div className="wrap">
          <h2>Giữ bàn cho nhóm</h2>
          <p className="sub">Điền thông tin, quán gọi lại xác nhận trong ngày.</p>
          <BookingForm today={todayVN()} />
        </div>
      </section>
    </>
  );
}
