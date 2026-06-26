import type { AdminFilter, DocItem } from "../../_components/types";

export type { DocItem };

export interface StructureCommercant {
  id_commercant: number;
  name_entreprise: string;
  email: string;
  tel: string;
  type_activity: string;
  forme_juridique: string;
  adresse: string;
  siret: string;
  created_at: string;
  docs: DocItem[];
}

export interface StructureAssociation {
  id_association: number;
  name_entreprise: string;
  email: string;
  tel: string;
  type_asso: string;
  adresse: string;
  rna: string;
  statut_abonnement: boolean;
  created_at: string;
  docs: DocItem[];
  cagnotte: number;
}

export interface StructuresFiltreProps {
  commercants: StructureCommercant[];
  commercantsTotal: number;
  associations: StructureAssociation[];
  associationsTotal: number;
  filter: AdminFilter;
  page: number;
  pageSize: number;
  search: string;
}
