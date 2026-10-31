import "server-only";
import { get, list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { SEED } from "./data";
import type { Booking, Content, Order } from "./types";

// Dữ liệu lưu thành các file JSON: Vercel Blob (private) khi có token, thư mục .data/ khi chạy local.
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const LOCAL_DIR = path.join(process.cwd(), ".data");

async function readJson<T>(key: string): Promise<T | null> {
  if (useBlob) {
    const res = await get(key, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text()) as T;
  }
  try {
    return JSON.parse(await fs.readFile(path.join(LOCAL_DIR, key), "utf8")) as T;
  } catch {
    return null;
  }
}

async function writeJson(key: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data);
  if (useBlob) {
    await put(key, body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  const file = path.join(LOCAL_DIR, key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body);
}

async function listKeys(prefix: string): Promise<string[]> {
  if (useBlob) {
    const keys: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor, limit: 1000 });
      keys.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return keys;
  }
  try {
    const dir = path.join(LOCAL_DIR, prefix);
    return (await fs.readdir(dir)).map((f) => path.posix.join(prefix, f));
  } catch {
    return [];
  }
}

function newId(): string {
  return `${Date.now().toString(36)}-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

async function listRecords<T extends { createdAt: string }>(prefix: string): Promise<T[]> {
  const keys = (await listKeys(prefix)).filter((k) => k.endsWith(".json"));
  const rows: T[] = [];
  for (const row of await Promise.all(keys.map((k) => readJson<T>(k)))) {
    if (row) rows.push(row);
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---- Nội dung (thực đơn, combo, khuyến mãi) ----

export async function getContent(): Promise<Content> {
  const saved = await readJson<Content>("content.json");
  return saved ?? SEED;
}

export async function saveContent(content: Content): Promise<void> {
  await writeJson("content.json", content);
}

// ---- Đặt bàn ----

export async function addBooking(input: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
  const booking: Booking = { ...input, id: newId(), createdAt: new Date().toISOString(), status: "moi" };
  await writeJson(`bookings/${booking.id}.json`, booking);
  return booking;
}

export const listBookings = () => listRecords<Booking>("bookings/");

export async function updateBooking(id: string, status: Booking["status"]): Promise<Booking | null> {
  const key = `bookings/${id}.json`;
  const current = await readJson<Booking>(key);
  if (!current) return null;
  const next = { ...current, status };
  await writeJson(key, next);
  return next;
}

// ---- Đơn mang về ----

export async function addOrder(input: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  const order: Order = { ...input, id: newId(), createdAt: new Date().toISOString(), status: "moi" };
  await writeJson(`orders/${order.id}.json`, order);
  return order;
}

export const listOrders = () => listRecords<Order>("orders/");

export async function updateOrder(id: string, status: Order["status"]): Promise<Order | null> {
  const key = `orders/${id}.json`;
  const current = await readJson<Order>(key);
  if (!current) return null;
  const next = { ...current, status };
  await writeJson(key, next);
  return next;
}
