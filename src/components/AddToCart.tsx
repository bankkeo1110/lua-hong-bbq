"use client";
import { useState } from "react";
import { useCart } from "./cart";

export default function AddToCart({
  kind,
  id,
  name,
  className = "btn amber sm",
}: {
  kind: "menu" | "combo";
  id: string;
  name: string;
  className?: string;
}) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      aria-label={`Thêm ${name} vào giỏ`}
      onClick={() => {
        add(kind, id);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
    >
      {done ? "Đã thêm" : "Thêm vào giỏ"}
    </button>
  );
}
