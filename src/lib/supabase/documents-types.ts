export const BUCKET = "user-documents";

export type DocType = "rib" | "kbis" | "identite";

export const DOC_LABELS: Record<DocType, string> = {
  rib: "RIB",
  kbis: "KBIS",
  identite: "Pièce d'identité",
};

export type UserDocEntry = {
  authId: string;
  nom: string;
  email: string;
  docs: { type: DocType; url: string }[];
};
