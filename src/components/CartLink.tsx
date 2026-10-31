"use client";
import Link from "next/link";
import { useCart } from "./cart";

export default function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/dat-mon" className="cartlink">
      Giỏ hàng
      {ready && count > 0 && (
        <span className="badge" aria-label={`${count} món trong giỏ`}>
          {count}
        </span>
      )}
    </Link>
  );
}
