import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { saveContent } from "@/lib/store";
import { contentSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const parsed = contentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: `${issue?.path.join(".") ?? ""}: ${issue?.message ?? "Dữ liệu chưa hợp lệ"}` }, { status: 400 });
  }
  const { menu, combos, promos } = parsed.data;
  const ids = new Set<string>();
  for (const x of [...menu.map((m) => m.id), ...combos.map((c) => c.id)]) {
    if (ids.has(x)) return NextResponse.json({ error: `Mã món bị trùng: ${x}` }, { status: 400 });
    ids.add(x);
  }
  if (new Set(promos.map((p) => p.slug)).size !== promos.length) {
    return NextResponse.json({ error: "Có hai bài khuyến mãi trùng slug" }, { status: 400 });
  }
  await saveContent(parsed.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
