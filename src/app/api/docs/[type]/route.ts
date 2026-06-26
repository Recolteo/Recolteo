import "server-only";
import type { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { encryptBuffer, decryptBuffer } from "@/src/lib/server/doc-crypto";
import { BUCKET, type DocType } from "@/src/lib/supabase/documents-types";

const VALID_TYPES: DocType[] = ["rib", "kbis", "identite"];
const DB_COL: Record<DocType, "rib" | "kbis" | "piece_identite"> = {
  rib: "rib",
  kbis: "kbis",
  identite: "piece_identite",
};

async function resolveUser(type: string) {
  if (!VALID_TYPES.includes(type as DocType)) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { user, docType: type as DocType };
}

async function resolveEntity(authId: string, admin: ReturnType<typeof createAdminClient>) {
  const { data: userRow } = await admin.from("user").select("id_user").eq("auth_id", authId).maybeSingle();
  if (!userRow) return null;
  const [{ data: com }, { data: asso }] = await Promise.all([
    admin.from("commercant").select("id_commercant").eq("id_user", userRow.id_user).maybeSingle(),
    admin.from("association").select("id_association").eq("id_user", userRow.id_user).maybeSingle(),
  ]);
  if (com) return { entityId: com.id_commercant, entityType: "commercant" as const };
  if (asso) return { entityId: asso.id_association, entityType: "association" as const };
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const ctx = await resolveUser(type);
  if (!ctx) return new Response("Non autorisé", { status: 401 });

  const admin = createAdminClient();
  const encPath = `${ctx.user.id}/${ctx.docType}.enc`;
  const pdfPath = `${ctx.user.id}/${ctx.docType}.pdf`;

  let encrypted = true;
  let blob: Blob | null = null;
  const { data: encBlob } = await admin.storage.from(BUCKET).download(encPath);
  if (encBlob) {
    blob = encBlob;
  } else {
    const { data: pdfBlob } = await admin.storage.from(BUCKET).download(pdfPath);
    blob = pdfBlob;
    encrypted = false;
  }

  if (!blob) return new Response("Document non trouvé", { status: 404 });

  const raw = Buffer.from(await blob.arrayBuffer());
  const pdf = encrypted ? decryptBuffer(raw) : raw;

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${ctx.docType}.pdf"`,
      "Cache-Control": "no-store, no-cache",
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const ctx = await resolveUser(type);
  if (!ctx) return new Response("Non autorisé", { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return new Response("Fichier manquant", { status: 400 });
  if (file.type !== "application/pdf") return new Response("PDF uniquement", { status: 400 });
  if (file.size > 10 * 1024 * 1024) return new Response("Fichier trop volumineux (max 10 Mo)", { status: 400 });

  const plain = Buffer.from(await file.arrayBuffer());
  const encrypted = encryptBuffer(plain);

  const admin = createAdminClient();
  const path = `${ctx.user.id}/${ctx.docType}.enc`;

  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, encrypted, {
    upsert: true,
    contentType: "application/octet-stream",
  });
  if (uploadError) return new Response("Erreur stockage", { status: 500 });

  const col = DB_COL[ctx.docType];
  const validatedCol = `${col}_validated`;
  const entity = await resolveEntity(ctx.user.id, admin);
  if (entity) {
    const { data: rowExists } = await admin
      .from("document")
      .select("id_entity")
      .eq("id_entity", entity.entityId)
      .eq("type_entity", entity.entityType)
      .maybeSingle();

    if (rowExists) {
      await admin.from("document")
        .update({ [col]: path, [validatedCol]: false, notification_sent: false })
        .eq("id_entity", entity.entityId)
        .eq("type_entity", entity.entityType);
    } else {
      await admin.from("document").insert({
        id_entity: entity.entityId,
        type_entity: entity.entityType,
        rib: col === "rib" ? path : "",
        kbis: col === "kbis" ? path : "",
        piece_identite: col === "piece_identite" ? path : "",
      });
    }

  }

  return Response.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const ctx = await resolveUser(type);
  if (!ctx) return new Response("Non autorisé", { status: 401 });

  const admin = createAdminClient();

  await admin.storage.from(BUCKET).remove([
    `${ctx.user.id}/${ctx.docType}.enc`,
    `${ctx.user.id}/${ctx.docType}.pdf`,
  ]);

  const entity = await resolveEntity(ctx.user.id, admin);
  if (entity) {
    const col = DB_COL[ctx.docType];
    await admin
      .from("document")
      .update({ [col]: "", [`${col}_validated`]: false, notification_sent: false })
      .eq("id_entity", entity.entityId)
      .eq("type_entity", entity.entityType);
  }

  return Response.json({ ok: true });
}
