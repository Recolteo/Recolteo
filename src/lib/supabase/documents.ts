"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";
import { createAdminClient } from "./admin";
import { BUCKET, type DocType, type UserDocEntry } from "./documents-types";

export async function getAdminAllDocuments(): Promise<UserDocEntry[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase.from("administrateur").select("id_admin").maybeSingle();
  if (!adminRow) return [];

  const admin = createAdminClient();

  const { data: docs } = await admin
    .from("document")
    .select("id_document, id_entity, type_entity, rib, kbis, piece_identite");
  if (!docs?.length) return [];

  const commercantIds = docs.filter((d) => d.type_entity === "commercant").map((d) => d.id_entity);
  const associationIds = docs.filter((d) => d.type_entity === "association").map((d) => d.id_entity);

  const [{ data: commercants }, { data: associations }] = await Promise.all([
    commercantIds.length
      ? admin.from("commercant").select("id_commercant, name_entreprise, email").in("id_commercant", commercantIds)
      : Promise.resolve({ data: [] }),
    associationIds.length
      ? admin.from("association").select("id_association, name_entreprise, email").in("id_association", associationIds)
      : Promise.resolve({ data: [] }),
  ]);

  const commercantMap = new Map((commercants ?? []).map((c) => [c.id_commercant, c]));
  const associationMap = new Map((associations ?? []).map((a) => [a.id_association, a]));

  const results = await Promise.all(
    docs.map(async (doc) => {
      const entity =
        doc.type_entity === "commercant"
          ? commercantMap.get(doc.id_entity)
          : associationMap.get(doc.id_entity);

      const paths: [DocType, string | null][] = [
        ["rib", doc.rib],
        ["kbis", doc.kbis],
        ["identite", doc.piece_identite],
      ];

      const docEntries = await Promise.all(
        paths
          .filter(([, path]) => !!path)
          .map(async ([type, path]) => {
            const { data } = await admin.storage.from(BUCKET).createSignedUrl(path!, 3600);
            if (!data?.signedUrl) return null;
            return { type, url: data.signedUrl };
          })
      );

      return {
        authId: `${doc.type_entity}-${doc.id_entity}`,
        nom: entity?.name_entreprise ?? `Entité #${doc.id_entity}`,
        email: entity?.email ?? "",
        docs: docEntries.filter((d): d is { type: DocType; url: string } => d !== null),
      } satisfies UserDocEntry;
    })
  );

  return results.filter((r) => r.docs.length > 0);
}
