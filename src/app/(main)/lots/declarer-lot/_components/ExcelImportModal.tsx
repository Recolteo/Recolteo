"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as XLSXType from "xlsx";
import { X, Upload, FileText, CheckCircle } from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";
import { importerLots, type LotImportRow } from "../actions";

const DRAG_THRESHOLD = 150;

async function genererModele() {
  const XLSX = await import("xlsx");

  const C = {
    sapin: "06573F",
    mid: "1B6B42",
    light: "3A8B5C",
    lime: "B8E6C1",
    limeDeep: "7DC48A",
    blanc: "FFFFFF",
    cream: "F9FDF9",
    rowReq: "EDF8F0",
    rowOpt: "FAFFFE",
    rowReqAlt: "E2F4E7",
    rowOptAlt: "F3FAFB",
    text: "1A3D2B",
    textMid: "3D6B50",
    bReq: "A8D5B5",
    bOpt: "C8E8D0",
  };

  const COL_DEFS = [
    { key: "Nature du lot", req: true, wch: 26, num: false },
    { key: "Catégorie", req: true, wch: 22, num: false },
    { key: "Volume (kg)", req: true, wch: 13, num: true },
    { key: "DLC", req: false, wch: 14, num: false },
    { key: "Valeur estimée (€)", req: false, wch: 19, num: true },
    { key: "Valeur en lettres", req: false, wch: 24, num: false },
    { key: "Adresse de récupération", req: true, wch: 32, num: false },
    { key: "Instructions", req: false, wch: 28, num: false },
  ] as const;

  const N = COL_DEFS.length;
  const BLANK_ROWS = 30;

  const mkCell = (v: string | number, t: "s" | "n" = "s") => ({ t, v });
  const thin = (rgb: string) => ({ style: "thin", color: { rgb } });
  const med = (rgb: string) => ({ style: "medium", color: { rgb } });

  const aoa: (string | number)[][] = [
    COL_DEFS.map((c) => c.key),
    ...Array(BLANK_ROWS).fill(COL_DEFS.map(() => "")),
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = COL_DEFS.map((c) => ({ wch: c.wch }));
  ws["!rows"] = [{ hpt: 30 }, ...Array(BLANK_ROWS).fill({ hpt: 20 })];

  for (let c = 0; c < N; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    const def = COL_DEFS[c];
    ws[addr].s = {
      font: { bold: true, size: 10, color: { rgb: C.blanc } },
      fill: {
        patternType: "solid",
        fgColor: { rgb: def.req ? C.sapin : C.light },
      },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        left: def.req ? med(C.mid) : thin(C.light),
        right: def.req ? thin(C.mid) : thin(C.light),
        top: def.req ? med(C.mid) : thin(C.light),
        bottom: def.req ? med(C.mid) : thin(C.limeDeep),
      },
    };
  }

  for (let r = 1; r <= BLANK_ROWS; r++) {
    const isAlt = r % 2 === 0;
    for (let c = 0; c < N; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) ws[addr] = mkCell("");
      const def = COL_DEFS[c];
      const bg = def.req
        ? isAlt
          ? C.rowReqAlt
          : C.rowReq
        : isAlt
          ? C.rowOptAlt
          : C.rowOpt;
      ws[addr].s = {
        font: { size: 10, color: { rgb: C.text } },
        fill: { patternType: "solid", fgColor: { rgb: bg } },
        alignment: {
          vertical: "center",
          horizontal: def.num ? "right" : "left",
        },
        border: {
          left: def.req ? med(C.bReq) : thin(C.bOpt),
          right: thin(def.req ? C.bReq : C.bOpt),
          top: thin(def.req ? C.bReq : C.bOpt),
          bottom: thin(def.req ? C.bReq : C.bOpt),
        },
      };
      if (def.key === "Volume (kg)") ws[addr].z = "0.0";
      if (def.key === "Valeur estimée (€)") ws[addr].z = "#,##0.00";
    }
  }

  const CATEGORIES = [
    { label: "Invendus alimentaires", bg: "1B6B42", fg: "FFFFFF" },
    { label: "Produits frais", bg: "2E7D50", fg: "FFFFFF" },
    { label: "Matières premières", bg: "3A8B5C", fg: "FFFFFF" },
    { label: "Matériel de bureau", bg: "4F9D6E", fg: "FFFFFF" },
    { label: "Équipements", bg: "65AF82", fg: "FFFFFF" },
    { label: "Livres & Jouets", bg: "7DC48A", fg: "1A3D2B" },
    { label: "Dons de vêtements", bg: "9AD4A5", fg: "1A3D2B" },
    { label: "Mobilier", bg: "B8E6C1", fg: "1A3D2B" },
    { label: "Autres ressources", bg: "D4F0DA", fg: "1A3D2B" },
  ];

  type CatRow = {
    type: "banner" | "subtitle" | "head" | "cat" | "note";
    text: string;
    idx?: number;
  };
  const catRows: CatRow[] = [
    { type: "banner", text: "RECOLTEO — Catégories de lots" },
    {
      type: "subtitle",
      text: "Copiez une valeur ci-dessous exactement dans la colonne « Catégorie » de votre import.",
    },
    { type: "head", text: "CATÉGORIES VALIDES" },
    ...CATEGORIES.map((cat, i) => ({
      type: "cat" as const,
      text: cat.label,
      idx: i,
    })),
    {
      type: "note",
      text: "Toute autre valeur sera acceptée mais ne correspondra à aucun filtre de recherche.",
    },
  ];

  const wsCat = XLSX.utils.aoa_to_sheet(catRows.map((r) => [r.text]));
  wsCat["!cols"] = [{ wch: 52 }];

  const catRowH: { hpt: number }[] = [];
  catRows.forEach((row, i) => {
    const addr = XLSX.utils.encode_cell({ r: i, c: 0 });
    if (!wsCat[addr]) return;
    if (row.type === "banner") {
      catRowH[i] = { hpt: 36 };
      wsCat[addr].s = {
        font: { bold: true, size: 15, color: { rgb: C.blanc } },
        fill: { patternType: "solid", fgColor: { rgb: C.sapin } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    } else if (row.type === "subtitle") {
      catRowH[i] = { hpt: 18 };
      wsCat[addr].s = {
        font: { italic: true, size: 9, color: { rgb: C.textMid } },
        fill: { patternType: "solid", fgColor: { rgb: C.lime } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: { bottom: thin(C.limeDeep) },
      };
    } else if (row.type === "head") {
      catRowH[i] = { hpt: 22 };
      wsCat[addr].s = {
        font: { bold: true, size: 10, color: { rgb: C.blanc } },
        fill: { patternType: "solid", fgColor: { rgb: C.mid } },
        alignment: { horizontal: "left", vertical: "center" },
      };
    } else if (row.type === "cat") {
      catRowH[i] = { hpt: 22 };
      const cat = CATEGORIES[row.idx!];
      wsCat[addr].s = {
        font: { bold: true, size: 11, color: { rgb: cat.fg } },
        fill: { patternType: "solid", fgColor: { rgb: cat.bg } },
        alignment: { horizontal: "left", vertical: "center" },
        border: {
          left: med(C.sapin),
          right: thin(C.bOpt),
          top: thin(C.bOpt),
          bottom: thin(C.bOpt),
        },
      };
    } else if (row.type === "note") {
      catRowH[i] = { hpt: 15 };
      wsCat[addr].s = {
        font: { italic: true, size: 8, color: { rgb: "999999" } },
        fill: { patternType: "solid", fgColor: { rgb: C.cream } },
        alignment: { horizontal: "left", vertical: "center" },
      };
    }
  });
  wsCat["!rows"] = catRowH;

  type GuideRow = {
    type: "title" | "section" | "item" | "spacer";
    text?: string;
  };
  const guide: GuideRow[] = [
    { type: "title", text: "Guide d'utilisation — Import de lots Recolteo" },
    { type: "spacer" },
    {
      type: "section",
      text: "CHAMPS OBLIGATOIRES  (fond vert foncé dans l'onglet import)",
    },
    {
      type: "item",
      text: "    Nature du lot — Description courte (ex : Pains, Fromages, Fruits frais…)",
    },
    {
      type: "item",
      text: "    Catégorie — Voir onglet « Catégories » pour les valeurs valides",
    },
    {
      type: "item",
      text: "    Volume (kg) — Poids en kilogrammes, décimales acceptées (ex : 2.5)",
    },
    {
      type: "item",
      text: "    Adresse de récupération — Adresse complète : numéro + rue + ville",
    },
    { type: "spacer" },
    {
      type: "section",
      text: "CHAMPS OPTIONNELS  (fond vert clair dans l'onglet import)",
    },
    {
      type: "item",
      text: "    DLC — Date limite au format AAAA-MM-JJ (ex : 2025-01-31)",
    },
    {
      type: "item",
      text: "    Valeur estimée (€) — En chiffres uniquement (ex : 75)",
    },
    {
      type: "item",
      text: "    Valeur en lettres — Doit correspondre à la valeur chiffrée",
    },
    {
      type: "item",
      text: "    Instructions — Consignes spéciales pour la collecte",
    },
    { type: "spacer" },
    { type: "section", text: "FORMATS ACCEPTÉS" },
    { type: "item", text: "    .xlsx — Microsoft Excel (recommandé)" },
    { type: "item", text: "    .xls — Excel ancien format" },
    { type: "item", text: "    .ods — LibreOffice / OpenOffice Calc" },
    {
      type: "item",
      text: "    .csv — Séparateur virgule ou point-virgule, encodage UTF-8",
    },
    { type: "spacer" },
    { type: "section", text: "CONSEILS" },
    {
      type: "item",
      text: "    Ne modifiez pas la ligne 1 (en-têtes de colonnes)",
    },
    { type: "item", text: "    Saisissez vos données à partir de la ligne 2" },
    {
      type: "item",
      text: "    Une ligne sans Nature, Catégorie, Volume ou Adresse sera ignorée",
    },
  ];

  const wsGuide = XLSX.utils.aoa_to_sheet(guide.map((g) => [g.text ?? ""]));
  wsGuide["!cols"] = [{ wch: 82 }];
  const gRowH: { hpt: number }[] = [];
  guide.forEach((row, i) => {
    const addr = XLSX.utils.encode_cell({ r: i, c: 0 });
    if (!wsGuide[addr]) return;
    if (row.type === "title") {
      gRowH[i] = { hpt: 32 };
      wsGuide[addr].s = {
        font: { bold: true, size: 14, color: { rgb: C.blanc } },
        fill: { patternType: "solid", fgColor: { rgb: C.sapin } },
        alignment: { horizontal: "left", vertical: "center" },
      };
    } else if (row.type === "section") {
      gRowH[i] = { hpt: 22 };
      wsGuide[addr].s = {
        font: { bold: true, size: 10, color: { rgb: C.blanc } },
        fill: { patternType: "solid", fgColor: { rgb: C.mid } },
        alignment: { horizontal: "left", vertical: "center" },
      };
    } else if (row.type === "item") {
      gRowH[i] = { hpt: 17 };
      wsGuide[addr].s = {
        font: { size: 10, color: { rgb: C.text } },
        fill: {
          patternType: "solid",
          fgColor: { rgb: i % 2 === 0 ? C.rowOpt : C.rowReq },
        },
        alignment: { horizontal: "left", vertical: "center" },
      };
    }
  });
  wsGuide["!rows"] = gRowH;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Lots à importer");
  XLSX.utils.book_append_sheet(wb, wsCat, "Catégories");
  XLSX.utils.book_append_sheet(wb, wsGuide, "Guide");
  XLSX.writeFile(wb, "modele_lots_recolteo.xlsx");
}

function parseRows(
  XLSX: typeof XLSXType,
  wb: XLSXType.WorkBook,
): LotImportRow[] {
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",
  });
  return raw
    .map((row) => ({
      nature: String(row["Nature du lot"] ?? "").trim(),
      category: String(row["Catégorie"] ?? "").trim(),
      quantity: parseFloat(String(row["Volume (kg)"] ?? "0")),
      dlc: String(row["DLC"] ?? "").trim() || null,
      montant_chiffre: parseFloat(String(row["Valeur estimée (€)"] ?? "0")),
      montant_lettre: String(row["Valeur en lettres"] ?? "").trim(),
      adresse_recup: String(row["Adresse de récupération"] ?? "").trim(),
      instructions: String(row["Instructions"] ?? "").trim() || null,
    }))
    .filter((r) => r.nature && r.adresse_recup && !isNaN(r.quantity));
}

type Props = {
  commercantId?: number;
  onClose: () => void;
};

export default function ExcelImportModal({ commercantId, onClose }: Props) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const startY = useRef(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const [draggingFile, setDraggingFile] = useState(false);
  const [rows, setRows] = useState<LotImportRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    setDragY(Math.max(0, e.touches[0].clientY - startY.current));
  };

  const handleTouchEnd = () => {
    dragging.current = false;
    setIsDragging(false);
    if (dragY >= DRAG_THRESHOLD) {
      setDragY(typeof window !== "undefined" ? window.innerHeight : 800);
      setTimeout(onClose, 280);
    } else {
      setDragY(0);
    }
  };

  const progress = Math.min(dragY / DRAG_THRESHOLD, 1);
  const backdropOpacity = 1 - progress * 0.7;

  const handleFile = useCallback((file: File) => {
    setError("");
    setRows(null);
    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();
    const reader = new FileReader();

    const onParsed = async (
      readType: "array" | "string",
      result: ArrayBuffer | string,
    ) => {
      try {
        const XLSX = await import("xlsx");
        const wb =
          readType === "string"
            ? XLSX.read(result as string, { type: "string" })
            : XLSX.read(new Uint8Array(result as ArrayBuffer), {
                type: "array",
              });
        const parsed = parseRows(XLSX, wb);
        if (!parsed.length) {
          setError(
            "Aucune ligne valide. Vérifiez que les colonnes correspondent au modèle.",
          );
          return;
        }
        setRows(parsed);
      } catch {
        setError(
          "Impossible de lire le fichier. Formats acceptés : Excel (.xlsx/.xls), LibreOffice (.ods), CSV (.csv).",
        );
      }
    };

    if (ext === "csv") {
      reader.onload = (e) => onParsed("string", e.target!.result as string);
      reader.readAsText(file, "UTF-8");
    } else {
      reader.onload = (e) => onParsed("array", e.target!.result as ArrayBuffer);
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const onDropFile = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDraggingFile(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleImport = async () => {
    if (!rows) return;
    setLoading(true);
    setError("");
    const result = await importerLots(rows, commercantId);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-cream/60 backdrop-blur-sm"
        style={{ opacity: backdropOpacity }}
      />

      <div
        className="relative z-10 w-full sm:max-w-xl bg-cream rounded-t-3xl sm:rounded-2xl border-2 border-sapin/10 shadow-[0_-4px_32px_0_color-mix(in_srgb,var(--color-sapin)_20%,transparent)] sm:shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-sapin)_15%,transparent)] overflow-hidden max-h-[92dvh] flex flex-col"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging
            ? "none"
            : "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-center pt-3 pb-2 sm:hidden touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="w-10 h-1 rounded-full transition-colors duration-150"
            style={{
              backgroundColor: `color-mix(in srgb, var(--color-sapin) ${20 + progress * 30}%, transparent)`,
            }}
          />
        </div>

        <div
          className="px-5 py-4 border-b border-sapin/8 flex items-center justify-between gap-3 sm:touch-auto touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-lime border border-sapin shadow-[2px_2px_0_0_#06573F] flex items-center justify-center shrink-0">
              <Upload size={16} className="text-sapin" />
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-sapin text-base leading-tight">
                Importer des lots
              </h2>
              <p className="text-xs text-sapin/50 mt-0.5">
                Excel, LibreOffice, Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-sapin/40 hover:text-sapin hover:bg-sapin/8 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 scroll-hide">
          <button
            onClick={genererModele}
            className="w-full flex items-center gap-3 bg-sapin/4 border border-sapin/10 rounded-2xl px-4 py-3 hover:bg-sapin/8 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-lime border border-sapin/20 flex items-center justify-center shrink-0">
              <FileText size={14} className="text-sapin" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-sapin">
                Télécharger le modèle
              </p>
              <p className="text-xs text-sapin/50 mt-0.5 truncate">
                modele_lots_recolteo.xlsx
              </p>
            </div>
            <span className="ml-auto text-xs font-bold text-sapin/40 shrink-0">
              ↓
            </span>
          </button>

          {!success && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDraggingFile(true);
              }}
              onDragLeave={() => setDraggingFile(false)}
              onDrop={onDropFile}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed cursor-pointer transition-all py-8 px-5 text-center ${
                draggingFile
                  ? "border-sapin bg-lime/15 scale-[1.01]"
                  : fileName
                    ? "border-sapin/40 bg-sapin/3"
                    : "border-sapin/15 hover:border-sapin/35 hover:bg-sapin/3"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,.ods,.csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                  draggingFile
                    ? "bg-lime border-sapin"
                    : "bg-sapin/6 border-sapin/15"
                }`}
              >
                <Upload size={18} className="text-sapin" />
              </div>
              {fileName ? (
                <>
                  <p className="text-sm font-black text-sapin">{fileName}</p>
                  <p className="text-xs text-sapin/40">
                    Cliquez pour changer de fichier
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-sapin">
                    Glissez votre fichier ici
                  </p>
                  <p className="text-xs text-sapin/40">
                    ou cliquez pour parcourir (.xlsx, .ods, .csv)
                  </p>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="bg-peach/6 border border-peach/20 rounded-2xl px-4 py-3">
              <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-1">
                Erreur
              </p>
              <p className="text-sm font-semibold text-peach">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-lime border border-sapin shadow-[3px_3px_0_0_#06573F] flex items-center justify-center">
                <CheckCircle size={28} className="text-sapin" />
              </div>
              <div>
                <p className="font-black text-sapin text-base">
                  {rows?.length} lot{(rows?.length ?? 0) > 1 ? "s" : ""} importé
                  {(rows?.length ?? 0) > 1 ? "s" : ""} !
                </p>
                <p className="text-xs text-sapin/50 mt-1">
                  Ils sont visibles dans votre catalogue.
                </p>
              </div>
              <Button
                label="Fermer"
                onClick={onClose}
                variant="sapin-outline"
                showArrow={false}
                size="sm"
              />
            </div>
          )}

          {rows && !success && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest">
                  Aperçu
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime/30 text-sapin border border-lime/50">
                  {rows.length} lot{rows.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-sapin/10 scroll-hide">
                <table className="w-full text-xs text-sapin">
                  <thead>
                    <tr className="bg-sapin/4">
                      {[
                        "Nature",
                        "Catégorie",
                        "kg",
                        "DLC",
                        "€",
                        "Adresse récup.",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-bold text-sapin/50 whitespace-nowrap text-[10px] uppercase tracking-widest"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr
                        key={i}
                        className="border-t border-sapin/6 hover:bg-sapin/2 transition-colors"
                      >
                        <td className="px-3 py-2 font-semibold truncate max-w-30">
                          {r.nature}
                        </td>
                        <td className="px-3 py-2 text-sapin/60 truncate max-w-30">
                          {r.category}
                        </td>
                        <td className="px-3 py-2 font-bold">{r.quantity}</td>
                        <td className="px-3 py-2 text-sapin/60">
                          {r.dlc ?? "—"}
                        </td>
                        <td className="px-3 py-2 font-bold text-peach">
                          {r.montant_chiffre}
                        </td>
                        <td className="px-3 py-2 text-sapin/60 truncate max-w-30">
                          {r.adresse_recup}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {rows && !success && (
          <div className="px-5 py-4 border-t border-sapin/8 bg-cream">
            <Button
              label={
                loading
                  ? "Import en cours…"
                  : `Importer ${rows.length} lot${rows.length > 1 ? "s" : ""}`
              }
              onClick={handleImport}
              disabled={loading}
              variant="sapin"
              showArrow={!loading}
              className="w-full justify-center"
            />
          </div>
        )}
      </div>
    </div>
  );
}
