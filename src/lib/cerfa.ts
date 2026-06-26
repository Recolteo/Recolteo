import "server-only";
import path from "path";
import fs from "fs";
import { PDFDocument, PDFName, StandardFonts, rgb } from "pdf-lib";

export type CerfaData = {
  numOrdre: string | number;
  association: {
    name_entreprise: string;
    rna: string;
    adresse: string;
    code_postal: string;
  };
  commercant: {
    name_entreprise: string;
    forme_juridique: string;
    siret: string;
    adresse: string;
    code_postal: string;
  };
  lot: {
    nature: string;
    quantity: number;
    montant_chiffre: number;
    montant_lettre: string;
  };
  dateCollect: string;
};

function parseAdresse(adresse: string): { rue: string; ville: string } {
  const lastComma = adresse.lastIndexOf(", ");
  if (lastComma === -1) return { rue: adresse, ville: "" };
  return {
    rue: adresse.substring(0, lastComma).trim(),
    ville: adresse.substring(lastComma + 2).trim(),
  };
}

function parseNumeroRue(rue: string): { numero: string; voie: string } {
  const match = rue.match(/^(\d+\s?(?:bis|ter|quater)?[a-zA-Z]?)\s+(.+)$/i);
  if (!match) return { numero: "", voie: rue };
  return { numero: match[1].trim(), voie: match[2].trim() };
}

async function getCommuneFromPostalCode(codePostal: string): Promise<string> {
  if (!/^\d{5}$/.test(codePostal)) return "";
  try {
    const res = await fetch(
      `${process.env.GEO_API_COMMUNES_URL}?codePostal=${codePostal}&fields=nom&format=json`,
    );
    if (!res.ok) return "";
    const data: { nom: string }[] = await res.json();
    return data[0]?.nom ?? "";
  } catch {
    return "";
  }
}

export async function generateCerfa(data: CerfaData): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), "src/asset/CERFA.pdf");
  const templateBytes = fs.readFileSync(templatePath);

  const pdf = await PDFDocument.load(templateBytes);
  const form = pdf.getForm();

  const { numOrdre, association, commercant, lot, dateCollect } = data;
  const siren = commercant.siret.replace(/\s/g, "").substring(0, 9);
  const montant = `${lot.montant_chiffre.toFixed(2)} euros`;

  const assocAddr = parseAdresse(association.adresse);
  const assocRue = parseNumeroRue(assocAddr.rue);
  const assocCommune =
    assocAddr.ville || (await getCommuneFromPostalCode(association.code_postal));

  form.getTextField("a1").setText(String(numOrdre));
  form.getTextField("a2").setText(association.name_entreprise);
  form.getTextField("a4").setText(association.rna);
  form.getTextField("a5").setText(assocRue.numero);
  form.getTextField("a6").setText(assocRue.voie);
  form.getTextField("a7").setText(association.code_postal);
  form.getTextField("a8").setText(assocCommune);
  form.getTextField("a9").setText("France");
  form.getTextField("a10").setText("Don de denrées alimentaires");

  form.getCheckBox("CAC1").check();
  const cac0 = form.getCheckBox("CAC0");
  cac0.acroField.getWidgets()[5].dict.set(PDFName.of("AS"), PDFName.of("6"));
  cac0.acroField.dict.set(PDFName.of("V"), PDFName.of("6"));

  const commAddr = parseAdresse(commercant.adresse);
  const commRue = parseNumeroRue(commAddr.rue);
  const commCommune =
    commAddr.ville || (await getCommuneFromPostalCode(commercant.code_postal));

  form.getTextField("b4").setText(commercant.name_entreprise);
  form.getTextField("b5").setText(commercant.forme_juridique);
  form.getTextField("b6").setText(siren);
  form.getTextField("b7").setText(commRue.numero);
  form.getTextField("b8").setText(commRue.voie);
  form.getTextField("b9").setText(commercant.code_postal);
  form.getTextField("b10").setText(commCommune);

  form.getTextField("b11").setText(montant);
  form.getTextField("b12").setText(lot.montant_lettre);
  form.getTextField("b14").setText(`${lot.nature} — Quantité : ${lot.quantity} kg`);

  form.getTextField("b18").setText(montant);
  form.getTextField("b19").setText(lot.montant_lettre);

  form.getTextField("b21").setText(dateCollect);
  form.getTextField("b27").setText(dateCollect);

  const font = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const page = pdf.getPages()[0];
  const sigText = commercant.name_entreprise;
  const sigNote = "Signé électroniquement";
  page.drawText(sigText, { x: 352, y: 168, size: 9, font, color: rgb(0.04, 0.34, 0.25) });
  page.drawText(sigNote, { x: 352, y: 156, size: 7, font, color: rgb(0.45, 0.45, 0.45) });

  form.flatten();

  const pdfBytes = await pdf.save();
  return Buffer.from(pdfBytes);
}
