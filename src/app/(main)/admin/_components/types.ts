export type AdminFilter = "all" | "commercant" | "association";

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
  rayon_action: number;
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
}
