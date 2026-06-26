import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type RecapData = {
  numeroSequentiel: string | number;
  date: string;
  creneau: string;
  commercant: { name_entreprise: string; adresse: string };
  association: { name_entreprise: string; adresse: string };
  lot: {
    nature: string;
    quantity: number;
    montant_chiffre: number;
    montant_lettre: string;
  };
};

const SAPIN   = rgb(0.024, 0.341, 0.247);
const LIME    = rgb(0.788, 0.949, 0.259);
const SAPIN08 = rgb(0.93, 0.96, 0.95);
const BEIGE   = rgb(0.965, 0.952, 0.925);
const SAPIN40 = rgb(0.42, 0.56, 0.50);
const LIME_HI = rgb(0.75, 0.93, 0.55);

function trunc(s: string, max = 65): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

type Page = ReturnType<PDFDocument["getPages"]>[0];

function drawDots(page: Page, startX: number, startY: number, cols = 6, rows = 5) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      page.drawEllipse({ x: startX + c * 10, y: startY - r * 10, xScale: 2.5, yScale: 2.5, color: SAPIN, opacity: 0.1 });
    }
  }
}

export async function generateRecap(data: RecapData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const W = page.getWidth();
  const H = page.getHeight();
  const PAD = 40;
  const inner = W - PAD * 2;

  const bold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const italic  = await doc.embedFont(StandardFonts.HelveticaOblique);

  // ── Header (70pt) ─────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: H - 70, width: W, height: 70, color: SAPIN });
  page.drawEllipse({ x: W - 20, y: H - 15, xScale: 58, yScale: 58, color: LIME, opacity: 0.14 });
  page.drawEllipse({ x: W + 12, y: H + 8,  xScale: 42, yScale: 42, color: LIME, opacity: 0.22 });

  page.drawText("FICHE DE COLLECTE", { x: PAD, y: H - 34, size: 20, font: bold,   color: LIME });
  page.drawText("Récoltéo",           { x: PAD, y: H - 55, size: 10, font: italic, color: LIME_HI });

  const numStr = `N° ${data.numeroSequentiel}`;
  page.drawText(numStr, {
    x: W - PAD - bold.widthOfTextAtSize(numStr, 13),
    y: H - 32, size: 13, font: bold, color: LIME,
  });
  const dateLabel = `Date : ${data.date}`;
  page.drawText(dateLabel, {
    x: W - PAD - regular.widthOfTextAtSize(dateLabel, 8),
    y: H - 50, size: 8, font: regular, color: LIME_HI,
  });

  // ── Dot pattern (top-right white area) ────────────────────────────────────
  drawDots(page, W - PAD - 50, H - 82);

  // ── Info block ────────────────────────────────────────────────────────────
  const infoTop = H - 92;
  const half    = inner / 2 - 10;
  const col2    = PAD + half + 18;
  const cardW   = W - PAD - col2;

  page.drawText("COLLECTE POUR", { x: PAD, y: infoTop, size: 7.5, font: bold, color: SAPIN40 });
  page.drawText(trunc(data.association.name_entreprise, 28), {
    x: PAD, y: infoTop - 20, size: 18, font: bold, color: SAPIN,
  });
  page.drawText(trunc(data.association.adresse || "—", 40), {
    x: PAD, y: infoTop - 38, size: 8.5, font: regular, color: SAPIN40,
  });

  page.drawRectangle({ x: col2 - 10, y: infoTop - 86, width: cardW + 10, height: 96, color: SAPIN08, borderColor: SAPIN, borderWidth: 0.5, borderOpacity: 0.15 });
  page.drawText("COMMERÇANT", { x: col2, y: infoTop, size: 7.5, font: bold, color: SAPIN40 });
  page.drawText(trunc(data.commercant.name_entreprise, 28), {
    x: col2, y: infoTop - 18, size: 12, font: bold, color: SAPIN,
  });
  page.drawText(trunc(data.commercant.adresse || "—", 34), {
    x: col2, y: infoTop - 34, size: 8.5, font: regular, color: SAPIN40,
  });
  page.drawText("CRÉNEAU", { x: col2, y: infoTop - 54, size: 7.5, font: bold, color: SAPIN40 });
  page.drawText(trunc(data.creneau, 40), {
    x: col2, y: infoTop - 68, size: 8, font: regular, color: SAPIN,
  });

  // ── Divider ───────────────────────────────────────────────────────────────
  const divY = infoTop - 100;
  page.drawLine({ start: { x: PAD, y: divY }, end: { x: W - PAD, y: divY }, thickness: 0.5, color: SAPIN, opacity: 0.15 });

  // ── Table ─────────────────────────────────────────────────────────────────
  const tableTop  = divY - 16;
  const colWidths = [inner * 0.5, inner * 0.2, inner * 0.3];
  const colX      = [PAD, PAD + colWidths[0], PAD + colWidths[0] + colWidths[1]];
  const headerH   = 30;
  const rowH      = 44;

  page.drawRectangle({ x: PAD, y: tableTop - headerH, width: inner, height: headerH, color: SAPIN });
  ["Contenu du lot", "Volume", "Valeur estimée"].forEach((h, i) => {
    page.drawText(h, { x: colX[i] + 12, y: tableTop - 19, size: 9, font: bold, color: LIME });
  });

  page.drawRectangle({ x: PAD, y: tableTop - headerH - rowH, width: inner, height: rowH, color: BEIGE, borderColor: SAPIN, borderWidth: 0.4, borderOpacity: 0.12 });
  page.drawText(trunc(data.lot.nature, 36),       { x: colX[0] + 12, y: tableTop - headerH - 27, size: 10.5, font: regular, color: SAPIN });
  page.drawText(`${data.lot.quantity} kg`,         { x: colX[1] + 12, y: tableTop - headerH - 27, size: 10.5, font: regular, color: SAPIN });
  const amtStr = `${data.lot.montant_chiffre.toFixed(2)} €`;
  page.drawText(amtStr,                            { x: colX[2] + 12, y: tableTop - headerH - 27, size: 10.5, font: bold,    color: SAPIN });

  // ── Summary (right) ────────────────────────────────────────────────────────
  const summaryX = PAD + inner * 0.5 + 5;
  const summaryW = W - PAD - summaryX;
  const sumTop   = tableTop - headerH - rowH - 20;

  page.drawRectangle({ x: summaryX, y: sumTop - 28, width: summaryW, height: 28, color: SAPIN08 });
  page.drawText("Sous-total :", {
    x: summaryX + 12, y: sumTop - 18, size: 8.5, font: regular, color: SAPIN40,
  });
  page.drawText(amtStr, {
    x: summaryX + summaryW - 12 - bold.widthOfTextAtSize(amtStr, 8.5),
    y: sumTop - 18, size: 8.5, font: bold, color: SAPIN,
  });

  page.drawRectangle({ x: summaryX, y: sumTop - 76, width: summaryW, height: 46, color: SAPIN });
  page.drawText("Total", {
    x: summaryX + 12, y: sumTop - 46, size: 8.5, font: regular, color: LIME,
  });
  const totalStr = `${data.lot.montant_chiffre.toFixed(2)} €`;
  page.drawText(totalStr, {
    x: summaryX + summaryW - 12 - bold.widthOfTextAtSize(totalStr, 16),
    y: sumTop - 63, size: 16, font: bold, color: LIME,
  });

  // ── Montant en lettres (left of summary) ──────────────────────────────────
  page.drawText("MONTANT EN LETTRES", { x: PAD, y: sumTop - 14, size: 7.5, font: bold, color: SAPIN40 });
  page.drawText(trunc(data.lot.montant_lettre || "—", 42), {
    x: PAD, y: sumTop - 30, size: 9.5, font: italic, color: SAPIN,
  });

  // ── Dot pattern (right side between table and legal) ─────────────────────
  drawDots(page, summaryX, sumTop - 86, 4, 4);

  // ── Cadre réglementaire ───────────────────────────────────────────────────
  const legalTop   = sumTop - 92;
  const legalLines = [
    "Conformément à l'article 238 bis du Code Général des Impôts, les dons en nature consentis par des entreprises",
    "assujetties à l'impôt ouvrent droit à une réduction d'impôt égale à 60 % du montant du don, retenu dans la",
    "limite de 20 000 € ou 5 ‰ du chiffre d'affaires hors taxe de l'exercice.",
    "",
    "Ce don est réalisé dans le cadre de la loi n° 2016-138 du 11 février 2016 relative à la lutte contre le",
    "gaspillage, dans le respect des normes de sécurité applicables aux biens cédés (alimentaires ou non).",
  ];
  page.drawRectangle({ x: PAD, y: legalTop - 94, width: inner, height: 104, color: SAPIN08, borderColor: SAPIN, borderWidth: 0.4, borderOpacity: 0.1 });
  page.drawText("CADRE RÉGLEMENTAIRE", { x: PAD + 12, y: legalTop - 12, size: 7.5, font: bold, color: SAPIN40 });
  legalLines.forEach((line, i) => {
    page.drawText(line, { x: PAD + 12, y: legalTop - 26 - i * 12, size: 7, font: regular, color: SAPIN40 });
  });

  // ── Signature ─────────────────────────────────────────────────────────────
  const sigTop  = legalTop - 110;
  const sigHalf = (inner / 2) - 8;
  page.drawLine({ start: { x: PAD, y: sigTop }, end: { x: W - PAD, y: sigTop }, thickness: 0.5, color: SAPIN, opacity: 0.15 });

  page.drawText("SIGNATURE DU COMMERÇANT", { x: PAD,          y: sigTop - 16, size: 7.5, font: bold, color: SAPIN40 });
  page.drawText("VALIDÉ PAR RÉCOLTÉO",     { x: PAD + sigHalf + 16, y: sigTop - 16, size: 7.5, font: bold, color: SAPIN40 });

  page.drawRectangle({ x: PAD,                y: sigTop - 68, width: sigHalf, height: 46, color: SAPIN08, borderColor: SAPIN, borderWidth: 0.4, borderOpacity: 0.12 });
  page.drawRectangle({ x: PAD + sigHalf + 16, y: sigTop - 68, width: sigHalf, height: 46, color: SAPIN08, borderColor: SAPIN, borderWidth: 0.4, borderOpacity: 0.12 });

  page.drawText(trunc(data.commercant.name_entreprise, 30), { x: PAD + 12, y: sigTop - 33, size: 10, font: italic,  color: SAPIN });
  page.drawText("Signé électroniquement via Récoltéo",      { x: PAD + 12, y: sigTop - 47, size: 7,  font: regular, color: SAPIN40 });
  page.drawText(`Le ${data.date}`,                          { x: PAD + 12, y: sigTop - 59, size: 7,  font: bold,    color: SAPIN40 });

  page.drawText("Récoltéo",                           { x: PAD + sigHalf + 28, y: sigTop - 33, size: 13,  font: bold,    color: SAPIN });
  page.drawText("Plateforme anti-gaspillage",             { x: PAD + sigHalf + 28, y: sigTop - 47, size: 7.5, font: italic,  color: SAPIN40 });
  page.drawText(`Le ${data.date}`,                    { x: PAD + sigHalf + 28, y: sigTop - 59, size: 7,   font: bold,    color: SAPIN40 });

  // ── Footer ────────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width: W, height: 55, color: SAPIN });
  drawDots(page, PAD, 63, 5, 4);
  page.drawText("Document généré automatiquement par Récoltéo · Aucune valeur juridique", {
    x: PAD, y: 34, size: 7, font: italic, color: LIME_HI,
  });
  page.drawText("Récoltéo", {
    x: W - PAD - bold.widthOfTextAtSize("Récoltéo", 11),
    y: 36, size: 11, font: bold, color: LIME,
  });
  const tagline = "Votre réseau qui échange vraiment proche de chez vous";
  page.drawText(tagline, {
    x: W - PAD - regular.widthOfTextAtSize(tagline, 7.5),
    y: 20, size: 7.5, font: italic, color: LIME_HI,
  });

  return Buffer.from(await doc.save());
}
