import type { DocType } from "@/src/lib/supabase/documents-types";

export type AdminFilter = "all" | "commercant" | "association";

export type DocItem = { type: DocType; url: string; validated: boolean };

export interface Commercant {
  id_commercant: number;
  name_entreprise: string;
  email: string;
  tel: string;
  type_activity: string;
  forme_juridique: string;
  adresse: string;
  siret: string;
  created_at: string;
}

export interface Association {
  id_association: number;
  name_entreprise: string;
  email: string;
  tel: string;
  type_asso: string;
  adresse: string;
  rna: string;
  created_at: string;
}

export interface AdminFiltreProps {
  commercants: Commercant[];
  commercantsTotal: number;
  associations: Association[];
  associationsTotal: number;
  filter: AdminFilter;
  page: number;
  pageSize: number;
  adminPrenom: string;
  adminNom: string;
  search: string;
}
