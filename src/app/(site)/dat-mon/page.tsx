import type { Metadata } from "next";
import Checkout from "@/components/Checkout";
import { SITE } from "@/lib/data";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Giỏ hàng và đặt món mang về" };
export const dynamic = "force-dynamic";

export default async function OrderPage() {
  const { menu, combos } = await getContent();
  return (
    <section className="s light" style={{ paddingTop: 50 }}>
      <div className="wrap">
        <h2>Giỏ hàng</h2>
        <p className="sub">Thanh toán tiền mặt khi nhận hàng. Giao trong khu vực quanh các chi nhánh.</p>
        <Checkout
          menu={menu.filter((m) => m.available).map(({ id, name, price }) => ({ id, name, price }))}
          combos={combos.filter((c) => c.available).map(({ id, name, price }) => ({ id, name, price }))}
          fee={SITE.deliveryFee}
          hotline={SITE.branches[0].phone}
        />
      </div>
    </section>
  );
}
