import type { DocItem } from "../_components/types";

export type RawDoc = {
  id_entity: number;
  rib: string | null;
  kbis: string | null;
  piece_identite: string | null;
  rib_validated: boolean;
  kbis_validated: boolean;
  piece_identite_validated: boolean;
};

export function buildDocs(doc: RawDoc | undefined): DocItem[] {
  if (!doc) return [];
  const items: DocItem[] = [];
  if (doc.rib) items.push({ type: "rib", url: `/api/docs/admin?path=${encodeURIComponent(doc.rib)}`, validated: doc.rib_validated });
  if (doc.kbis) items.push({ type: "kbis", url: `/api/docs/admin?path=${encodeURIComponent(doc.kbis)}`, validated: doc.kbis_validated });
  if (doc.piece_identite) items.push({ type: "identite", url: `/api/docs/admin?path=${encodeURIComponent(doc.piece_identite)}`, validated: doc.piece_identite_validated });
  return items;
}
