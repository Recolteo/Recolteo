import "server-only";
import type { NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { decryptBuffer } from "@/src/lib/server/doc-crypto";
import { BUCKET } from "@/src/lib/supabase/documents-types";

const PATH_RE = /^[0-9a-f-]{36}\/(rib|kbis|identite)\.(enc|pdf)$/;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Non autorisé", { status: 401 });

  const { data: adminRow } = await supabase.from("administrateur").select("id_admin").maybeSingle();
  if (!adminRow) return new Response("Accès refusé", { status: 403 });

  const path = req.nextUrl.searchParams.get("path");
  if (!path || !PATH_RE.test(path)) return new Response("Paramètre invalide", { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).download(path);
  if (error || !data) return new Response("Document non trouvé", { status: 404 });

  const raw = Buffer.from(await data.arrayBuffer());
  const pdf = path.endsWith(".enc") ? decryptBuffer(raw) : raw;
  const filename = path.split("/")[1].replace(".enc", ".pdf");

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache",
    },
  });
}
