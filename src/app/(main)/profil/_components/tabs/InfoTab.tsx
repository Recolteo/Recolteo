type EntityInfo =
  | {
      role: "commercant";
      name_entreprise: string;
      email: string;
      tel: string;
      siret: string;
      type_activity: string;
      forme_juridique: string;
      adresse: string;
      code_postal: string | null;
    }
  | {
      role: "association";
      name_entreprise: string;
      email: string;
      tel: string;
      rna: string;
      type_asso: string;
      adresse: string;
      code_postal: string | null;
      cagnotte: number;
    }
  | { role: "admin"; nom: string; prenom: string };

export type { EntityInfo };

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-6 py-3.5 border-b border-sapin/8 last:border-0">
      <span className="text-[11px] font-black uppercase tracking-widest text-sapin/40 shrink-0">
        {label}
      </span>
      <span className="font-semibold text-sapin text-right break-all leading-snug">{value}</span>
    </div>
  );
}

export default function InfoTab({ entityInfo }: { entityInfo: EntityInfo | null }) {
  if (!entityInfo)
    return (
      <p className="text-sapin/40 py-8 text-center">Informations non disponibles.</p>
    );

  if (entityInfo.role === "admin")
    return (
      <div>
        <InfoRow label="Prénom" value={entityInfo.prenom} />
        <InfoRow label="Nom" value={entityInfo.nom} />
      </div>
    );

  const adresseComplete = [
    entityInfo.adresse,
    entityInfo.code_postal,
  ]
    .filter(Boolean)
    .join(" — ");

  const common = (
    <>
      <InfoRow label="Email" value={entityInfo.email} />
      <InfoRow label="Téléphone" value={entityInfo.tel} />
      <InfoRow label="Adresse" value={adresseComplete} />
    </>
  );

  if (entityInfo.role === "commercant")
    return (
      <div>
        <InfoRow label="Entreprise" value={entityInfo.name_entreprise} />
        {common}
        <InfoRow label="SIRET" value={entityInfo.siret} />
        <InfoRow label="Activité" value={entityInfo.type_activity} />
        <InfoRow label="Forme juridique" value={entityInfo.forme_juridique} />
      </div>
    );

  return (
    <div>
      <InfoRow label="Association" value={entityInfo.name_entreprise} />
      {common}
      <InfoRow label="RNA" value={entityInfo.rna} />
      <InfoRow label="Type" value={entityInfo.type_asso} />
      <InfoRow
        label="Cagnotte"
        value={entityInfo.cagnotte.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
      />
    </div>
  );
}
