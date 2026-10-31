import { z } from "zod";

const phone = z
  .string()
  .trim()
  .transform((s) => s.replace(/[\s.\-()]/g, ""))
  .refine((s) => /^(\+84|0)\d{9,10}$/.test(s), "Số điện thoại chưa đúng");

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80),
  phone,
  branch: z.string().trim().min(1).max(40),
  guests: z.coerce.number().int().min(1, "Tối thiểu 1 người").max(60, "Nhóm trên 60 người vui lòng gọi hotline"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Vui lòng chọn ngày"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Vui lòng chọn giờ"),
  note: z.string().trim().max(300).default(""),
  website: z.string().max(0).optional(), // ô ẩn chống bot
});

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80),
  phone,
  address: z.string().trim().min(8, "Vui lòng nhập địa chỉ giao hàng").max(200),
  note: z.string().trim().max(300).default(""),
  lines: z
    .array(
      z.object({
        kind: z.enum(["menu", "combo"]),
        id: z.string().min(1).max(80),
        qty: z.coerce.number().int().min(1).max(50),
      }),
    )
    .min(1, "Giỏ hàng đang trống")
    .max(40),
  website: z.string().max(0).optional(),
});

export const contentSchema = z.object({
  menu: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        category: z.enum(["thit", "haisan", "do-uong"]),
        name: z.string().min(1).max(100),
        desc: z.string().max(200),
        price: z.number().int().min(0).max(100_000_000),
        unit: z.string().max(20),
        available: z.boolean(),
      }),
    )
    .max(300),
  combos: z
    .array(
      z.object({
        id: z.string().min(1).max(80),
        name: z.string().min(1).max(100),
        forWho: z.string().max(60),
        items: z.array(z.string().max(120)).max(20),
        price: z.number().int().min(0).max(100_000_000),
        featured: z.boolean(),
        available: z.boolean(),
      }),
    )
    .max(50),
  promos: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/, "Slug chỉ gồm a-z, 0-9 và dấu gạch ngang").max(80),
        title: z.string().min(1).max(160),
        excerpt: z.string().max(300),
        body: z.string().max(10_000),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        published: z.boolean(),
      }),
    )
    .max(100),
});

export const statusSchema = z.object({ status: z.string() });
