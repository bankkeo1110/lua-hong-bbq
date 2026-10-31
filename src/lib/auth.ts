import "server-only";
import { cookies } from "next/headers";
import { timingSafeEqual, createHmac } from "node:crypto";

export const COOKIE = "lh_admin";
const MAX_AGE = 60 * 60 * 12; // 12 giờ

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("Thiếu SESSION_SECRET (tối thiểu 16 ký tự)");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(
    createHmac("sha256", "pw").update(input).digest("hex"),
    createHmac("sha256", "pw").update(expected).digest("hex"),
  );
}

export function makeSessionValue(): string {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  try {
    return verifySessionValue(jar.get(COOKIE)?.value);
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = MAX_AGE;
