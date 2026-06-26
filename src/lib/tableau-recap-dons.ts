import "server-only";
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";

const BLACK = rgb(0.05, 0.05, 0.05);
const LGRAY = rgb(0.88, 0.88, 0.88);
const MGRAY = rgb(0.50, 0.50, 0.50);
const WHITE = rgb(1, 1, 1);

const PW = 595.28;   // Portrait A4
const PH = 841.89;
const PAD = 22;

export type DonRow = {
  montant: number;
  date: string;
  beneficiaireSiren: string;
  beneficiaireRna: string;
  beneficiaireNom: string;
  beneficiaireAdresse: string;
  intermediaireSiren: string;
  intermediaireRna: string;
  intermediaireNom: string;
  valeurContrepartie: number;
};

//  0:Montant  1:Date  2:SIREN_B  3:RNA_B  4:Nom_B  5:Adresse_B  6:SIREN_I  7:RNA_I  8:Nom_I  9:Valeur
// Total = PW - 2*PAD = 551.28 pt
const COL_W   = [48, 52, 40, 44, 75, 110, 40, 44, 64.28, 34] as const;
const DATA_FS = [ 7,  7,  6,  6, 6.5,  6.5,  6,  6,  6.5,  6] as const;

const SEC_H          = 18;
const GRP_H          = 16;
const COL_TOP_H      = 14;
const COL_BOT_H      = 24;
const COL_HDR_H      = COL_TOP_H + COL_BOT_H;   // = 38
const TABLE_HEADER_H = SEC_H + GRP_H + COL_HDR_H; // = 72
const ROW_H          = 35;
const TOP_H          = 70;

// ROWS_PER_PAGE: how many data rows fit before the footer zone (total + gap + footnotes + margin)
// Footer zone ≈ ROW_H(35) + 10 + 78(notes) + 20 = 143
// Available for rows = PH - TOP_H - TABLE_HEADER_H - 143 = 841.89 - 70 - 72 - 143 = 556.89 → floor(556.89/35) = 15
const ROWS_PER_PAGE = 15;

type Fonts = { bold: PDFFont; regular: PDFFont; oblique: PDFFont };

function colX(i: number): number {
  let x = PAD;
  for (let j = 0; j < i; j++) x += COL_W[j];
  return x;
}
function tableWidth(): number { return COL_W.reduce((s, w) => s + w, 0); }

// Truncate text so it fits within maxW points
function truncW(text: string, font: PDFFont, size: number, maxW: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxW) return text;
  let t = text;
  while (t.length > 1 && font.widthOfTextAtSize(t + ".", size) > maxW) t = t.slice(0, -1);
  return t + ".";
}

// Draw a bordered cell rectangle
function cell(page: PDFPage, x: number, y: number, w: number, h: number, bg = WHITE) {
  page.drawRectangle({ x, y: y - h, width: w, height: h, color: bg, borderColor: BLACK, borderWidth: 0.5 });
}

// Text centered horizontally in [x, x+w], baseline at given y
function textH(page: PDFPage, text: string, x: number, y: number, w: number, size: number, font: PDFFont) {
  const tw = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: x + Math.max(2, (w - tw) / 2), y, size, font, color: BLACK });
}

// Text centered horizontally AND vertically inside a cell
// cellTopY = top edge of the cell, cellH = cell height
function textVC(page: PDFPage, text: string, x: number, cellTopY: number, cellH: number, w: number, size: number, font: PDFFont) {
  // baseline = center of cell minus half cap-height (≈ size * 0.36)
  const y = cellTopY - cellH / 2 - size * 0.36;
  textH(page, text, x, y, w, size, font);
}

// Two-line text vertically centered inside a cell
function textVC2(page: PDFPage, l1: string, l2: string, x: number, cellTopY: number, cellH: number, w: number, size: number, font: PDFFont) {
  const leading  = size * 1.35;
  const blockH   = size * 0.72 + leading;             // cap-height of l1 + descend to l2 baseline
  const midY     = cellTopY - cellH / 2;              // visual center of cell
  const y1 = midY + blockH / 2 - size * 0.72;         // top line baseline
  const y2 = y1 - leading;                             // bottom line baseline
  textH(page, l1, x, y1, w, size, font);
  textH(page, l2, x, y2, w, size, font);
}

function drawDocHeader(page: PDFPage, pageNum: number, totalPages: number, fonts: Fonts) {
  const fs = 7.5;
  const L1 = "Annexe à la 2069-RCI-SD pour les entreprises ayant effectué au cours de l'exercice plus de 10 000 € de dons et versements";
  const L2 = "ouvrant droit à la réduction d'impôt prévue à l'article 238 bis du code général des impôts.";

  page.drawText(L1, { x: PAD, y: PH - 28, size: fs, font: fonts.bold, color: BLACK });
  page.drawLine({ start: { x: PAD, y: PH - 30 }, end: { x: PAD + fonts.bold.widthOfTextAtSize(L1, fs), y: PH - 30 }, thickness: 0.5, color: BLACK });
  page.drawText(L2, { x: PAD, y: PH - 42, size: fs, font: fonts.bold, color: BLACK });
  page.drawLine({ start: { x: PAD, y: PH - 44 }, end: { x: PAD + fonts.bold.widthOfTextAtSize(L2, fs), y: PH - 44 }, thickness: 0.5, color: BLACK });

  const gen = `Généré par Récoltéo — ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
  page.drawText(gen, { x: PW - PAD - fonts.oblique.widthOfTextAtSize(gen, 6.5), y: PH - 59, size: 6.5, font: fonts.oblique, color: MGRAY });

  if (totalPages > 1) {
    const pg = `Page ${pageNum} / ${totalPages}`;
    page.drawText(pg, { x: PW - PAD - fonts.regular.widthOfTextAtSize(pg, 7), y: PH - 28, size: 7, font: fonts.regular, color: MGRAY });
  }
}

function drawTableHeaders(page: PDFPage, tableTop: number, fonts: Fonts) {
  const TW = tableWidth();

  // ── Section title ──────────────────────────────────────────────────
  cell(page, PAD, tableTop, TW, SEC_H, LGRAY);
  page.drawText("III – MÉCÉNAT – LISTE DES BÉNÉFICIAIRES FINAUX (7)", {
    x: PAD + 5, y: tableTop - SEC_H / 2 - 8 * 0.36, size: 8, font: fonts.bold, color: BLACK,
  });

  // ── Group header row ───────────────────────────────────────────────
  const grpTop = tableTop - SEC_H;

  cell(page, colX(0), grpTop, COL_W[0], GRP_H, LGRAY);
  cell(page, colX(1), grpTop, COL_W[1], GRP_H, LGRAY);

  const bX = colX(2), bW = COL_W[2] + COL_W[3] + COL_W[4] + COL_W[5];
  cell(page, bX, grpTop, bW, GRP_H, LGRAY);
  textVC(page, "Bénéficiaire (8)", bX, grpTop, GRP_H, bW, 8, fonts.regular);

  const iX = colX(6), iW = COL_W[6] + COL_W[7] + COL_W[8];
  cell(page, iX, grpTop, iW, GRP_H, LGRAY);
  textVC(page, "Intermédiaire (6)", iX, grpTop, GRP_H, iW, 8, fonts.regular);

  cell(page, colX(9), grpTop, COL_W[9], GRP_H, LGRAY);

  // ── Column header row ──────────────────────────────────────────────
  const hTop = grpTop - GRP_H;

  // Col 0 — Montant des dons
  cell(page, colX(0), hTop, COL_W[0], COL_HDR_H, LGRAY);
  textVC2(page, "Montant", "des dons", colX(0), hTop, COL_HDR_H, COL_W[0], 7, fonts.regular);

  // Col 1 — Date de versement
  cell(page, colX(1), hTop, COL_W[1], COL_HDR_H, LGRAY);
  textVC2(page, "Date de", "versement", colX(1), hTop, COL_HDR_H, COL_W[1], 7, fonts.regular);

  // Cols 2+3 — N° d'identification (10) → N° SIREN / N° RNA
  const n10W = COL_W[2] + COL_W[3];
  cell(page, colX(2), hTop, n10W, COL_TOP_H, LGRAY);
  textVC(page, "N° d'identification (10)", colX(2), hTop, COL_TOP_H, n10W, 6, fonts.regular);
  const sub10Top = hTop - COL_TOP_H;
  cell(page, colX(2), sub10Top, COL_W[2], COL_BOT_H, LGRAY);
  textVC2(page, "N°", "SIREN", colX(2), sub10Top, COL_BOT_H, COL_W[2], 6.5, fonts.regular);
  cell(page, colX(3), sub10Top, COL_W[3], COL_BOT_H, LGRAY);
  textVC2(page, "N°", "RNA", colX(3), sub10Top, COL_BOT_H, COL_W[3], 6.5, fonts.regular);

  // Col 4 — Nom
  cell(page, colX(4), hTop, COL_W[4], COL_HDR_H, LGRAY);
  textVC(page, "Nom", colX(4), hTop, COL_HDR_H, COL_W[4], 7, fonts.regular);

  // Col 5 — Adresse
  cell(page, colX(5), hTop, COL_W[5], COL_HDR_H, LGRAY);
  textVC(page, "Adresse", colX(5), hTop, COL_HDR_H, COL_W[5], 7, fonts.regular);

  // Cols 6+7 — N° d'identification (8) → N° SIREN / N° RNA
  const n8W = COL_W[6] + COL_W[7];
  cell(page, colX(6), hTop, n8W, COL_TOP_H, LGRAY);
  textVC(page, "N° d'identification (8)", colX(6), hTop, COL_TOP_H, n8W, 6, fonts.regular);
  const sub8Top = hTop - COL_TOP_H;
  cell(page, colX(6), sub8Top, COL_W[6], COL_BOT_H, LGRAY);
  textVC2(page, "N°", "SIREN", colX(6), sub8Top, COL_BOT_H, COL_W[6], 6.5, fonts.regular);
  cell(page, colX(7), sub8Top, COL_W[7], COL_BOT_H, LGRAY);
  textVC2(page, "N°", "RNA", colX(7), sub8Top, COL_BOT_H, COL_W[7], 6.5, fonts.regular);

  // Col 8 — Nom
  cell(page, colX(8), hTop, COL_W[8], COL_HDR_H, LGRAY);
  textVC(page, "Nom", colX(8), hTop, COL_HDR_H, COL_W[8], 7, fonts.regular);

  // Col 9 — Valeur contrepartie (3 lines)
  cell(page, colX(9), hTop, COL_W[9], COL_HDR_H, LGRAY);
  const leading9 = 6 * 1.3;
  const blockH9  = 6 * 0.72 + 2 * leading9;
  const mid9     = hTop - COL_HDR_H / 2;
  const y9a = mid9 + blockH9 / 2 - 6 * 0.72;
  textH(page, "Valeur",   colX(9), y9a,            COL_W[9], 6, fonts.regular);
  textH(page, "contrep.", colX(9), y9a - leading9,  COL_W[9], 6, fonts.regular);
  textH(page, "(9)",      colX(9), y9a - 2*leading9, COL_W[9], 6, fonts.regular);
}

function drawDataRow(page: PDFPage, row: DonRow, rowY: number, fonts: Fonts) {
  for (let i = 0; i < 10; i++) cell(page, colX(i), rowY, COL_W[i], ROW_H);

  const baseY = rowY - ROW_H / 2 - 7 * 0.36;  // vertically centered for 7pt reference
  const pad = 3;

  const vals: [string, number][] = [
    [row.montant > 0 ? `${row.montant.toFixed(2)} €` : "", 0],
    [row.date, 1],
    [row.beneficiaireSiren, 2],
    [row.beneficiaireRna, 3],
    [row.beneficiaireNom, 4],
    [row.beneficiaireAdresse, 5],
    [row.intermediaireSiren, 6],
    [row.intermediaireRna, 7],
    [row.intermediaireNom, 8],
    [row.valeurContrepartie > 0 ? `${row.valeurContrepartie.toFixed(2)} €` : "", 9],
  ];

  for (const [raw, i] of vals) {
    if (!raw) continue;
    const size = DATA_FS[i];
    // Adjust baseline for the actual font size of this column
    const y = rowY - ROW_H / 2 - size * 0.36;
    const text = truncW(raw, fonts.regular, size, COL_W[i] - 2 * pad);
    page.drawText(text, { x: colX(i) + pad, y, size, font: fonts.regular, color: BLACK });
  }
}

function drawTotalRow(page: PDFPage, rows: DonRow[], rowY: number, fonts: Fonts) {
  const total = rows.reduce((s, r) => s + r.montant, 0);
  page.drawRectangle({ x: PAD, y: rowY - ROW_H, width: tableWidth(), height: ROW_H, color: LGRAY, borderColor: BLACK, borderWidth: 0.5 });
  const y = rowY - ROW_H / 2 - 8 * 0.36;
  page.drawText(`TOTAL : ${total.toFixed(2)} €  (${rows.length} versement(s))`, { x: PAD + 5, y, size: 8, font: fonts.bold, color: BLACK });
}

function drawContinuation(page: PDFPage, rowY: number, fonts: Fonts) {
  page.drawRectangle({ x: PAD, y: rowY - ROW_H, width: tableWidth(), height: ROW_H, color: LGRAY, borderColor: BLACK, borderWidth: 0.5 });
  const y = rowY - ROW_H / 2 - 7 * 0.36;
  page.drawText("(suite page suivante)", { x: PAD + 5, y, size: 7, font: fonts.oblique, color: MGRAY });
}

function drawFootnotes(page: PDFPage, startY: number, fonts: Fonts) {
  page.drawLine({ start: { x: PAD, y: startY }, end: { x: PAD + 200, y: startY }, thickness: 0.5, color: BLACK });
  const notes = [
    "(7) Tableau à remplir pour les entreprises assujetties à l'impôt sur le revenu ou sur les sociétés ayant effectué plus de",
    "    10 000 € de dons ouvrant droit à la réduction d'impôt en faveur du mécénat (art. 238 bis CGI, BOI-BIC-RICI-20-30-40).",
    "(8) L'entreprise se fait communiquer l'identité du bénéficiaire final, le montant et la date des versements correspondants,",
    "    ainsi que le cas échéant la valeur des contreparties reçues (cf §70 du BOI-BIC-RICI-20-30-40).",
    "(9) Valeur des biens et services reçus directement ou indirectement en contrepartie.",
    "(10) Numéro SIREN et, à défaut, numéro RNA si entité française.",
    "(6) À renseigner si les dons transitent par un organisme intermédiaire.",
  ];
  let y = startY - 9;
  for (const note of notes) {
    page.drawText(note, { x: PAD, y, size: 6, font: fonts.regular, color: BLACK });
    y -= 8.5;
  }
}

export async function generateTableauRecapDons(rows: DonRow[]): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const bold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const oblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const fonts: Fonts = { bold, regular, oblique };

  const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const page      = doc.addPage([PW, PH]);
    page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: WHITE });

    const isLastPage = pageIdx === totalPages - 1;
    const pageRows   = rows.slice(pageIdx * ROWS_PER_PAGE, (pageIdx + 1) * ROWS_PER_PAGE);

    drawDocHeader(page, pageIdx + 1, totalPages, fonts);

    const tableTop   = PH - TOP_H;
    const dataStartY = tableTop - TABLE_HEADER_H;
    drawTableHeaders(page, tableTop, fonts);

    for (let i = 0; i < pageRows.length; i++) {
      drawDataRow(page, pageRows[i], dataStartY - i * ROW_H, fonts);
    }

    const afterRowsY = dataStartY - pageRows.length * ROW_H;

    if (isLastPage) {
      drawTotalRow(page, rows, afterRowsY, fonts);
      drawFootnotes(page, afterRowsY - ROW_H - 10, fonts);
    } else {
      drawContinuation(page, afterRowsY, fonts);
      drawFootnotes(page, afterRowsY - ROW_H - 10, fonts);
    }
  }

  return Buffer.from(await doc.save());
}
