"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type StatutCommande = "preparation" | "livraison" | "pret";

interface Commande {
  id: string;
  nomCommercant: string;
  adresse: string;
  lots: string[];
  statut: StatutCommande;
  dlc: string;
  heureEstimee?: string;
}

const MOCK_COMMANDES: Commande[] = [
  {
    id: "CMD-001",
    nomCommercant: "Boulangerie Du Moulin",
    adresse: "12 rue des Fleurs, Paris 11e",
    lots: ["Pain de campagne x4", "Croissants x10", "Brioches x6"],
    statut: "pret",
    dlc: "Aujourd'hui 20h00",
    heureEstimee: "Disponible maintenant",
  },
  {
    id: "CMD-002",
    nomCommercant: "Marché Bio Saint-Martin",
    adresse: "34 avenue Carnot, Paris 17e",
    lots: ["Légumes de saison 3kg", "Fruits mixtes 2kg"],
    statut: "livraison",
    dlc: "Aujourd'hui 19h30",
    heureEstimee: "Arrivée estimée 17h45",
  },
  {
    id: "CMD-003",
    nomCommercant: "Épicerie La Ruche",
    adresse: "8 rue Oberkampf, Paris 11e",
    lots: ["Conserves assorties x12", "Pâtes x8", "Riz 5kg"],
    statut: "preparation",
    dlc: "Demain 12h00",
    heureEstimee: "Départ prévu 16h00",
  },
  {
    id: "CMD-004",
    nomCommercant: "Fromagerie Centrale",
    adresse: "2 place de la République, Paris 3e",
    lots: ["Fromages affinés x5", "Yaourts x20"],
    statut: "preparation",
    dlc: "Aujourd'hui 21h00",
    heureEstimee: "Départ prévu 15h30",
  },
];

const ETAPES = [
  { key: "preparation", label: "En préparation", short: "Préparation" },
  { key: "livraison", label: "En cours de livraison", short: "Livraison" },
  { key: "pret", label: "Prêt à récupérer", short: "Prêt" },
] as const;

function getStatutIndex(statut: StatutCommande): number {
  return ETAPES.findIndex((e) => e.key === statut);
}

function StatutBadge({ statut }: { statut: StatutCommande }) {
  const config = {
    preparation: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", label: "En préparation" },
    livraison: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", label: "En livraison" },
    pret: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Prêt à récupérer" },
  }[statut];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </span>
  );
}

function Jauge({ statut }: { statut: StatutCommande }) {
  const currentIndex = getStatutIndex(statut);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {ETAPES.map((etape, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === ETAPES.length - 1;

          return (
            <div key={etape.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted
                      ? "bg-sapin border-sapin"
                      : isCurrent
                      ? "bg-sapin border-sapin shadow-lg shadow-sapin/30"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  )}
                </motion.div>
                <span className={`text-[10px] font-medium whitespace-nowrap ${
                  isCompleted || isCurrent ? "text-sapin" : "text-gray-400"
                }`}>
                  {etape.short}
                </span>
              </div>

              {!isLast && (
                <div className="flex-1 h-0.5 mx-1 mb-5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="h-full bg-sapin rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CarteCommande({ commande }: { commande: Commande }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">{commande.id}</p>
            <h3 className="text-sapin font-bold text-base leading-tight">{commande.nomCommercant}</h3>
            <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {commande.adresse}
            </p>
          </div>
          <StatutBadge statut={commande.statut} />
        </div>

        <Jauge statut={commande.statut} />

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">DLC</p>
              <p className="text-xs font-semibold text-gray-700">{commande.dlc}</p>
            </div>
            {commande.heureEstimee && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Estimation</p>
                <p className="text-xs font-semibold text-sapin">{commande.heureEstimee}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-sapin font-medium flex items-center gap-1 hover:underline"
          >
            {expanded ? "Masquer" : `${commande.lots.length} lot${commande.lots.length > 1 ? "s" : ""}`}
            <motion.svg
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-3.5 h-3.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 bg-gray-50/60 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-3 mb-2">Contenu du lot</p>
              <ul className="space-y-1">
                {commande.lots.map((lot, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1 h-1 rounded-full bg-sapin/50 flex-shrink-0" />
                    {lot}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const FILTRES = [
  { key: "tous", label: "Tous" },
  { key: "preparation", label: "En préparation" },
  { key: "livraison", label: "En livraison" },
  { key: "pret", label: "Prêts" },
] as const;

type FiltreKey = "tous" | StatutCommande;

export default function SuiviCollecte() {
  const [filtre, setFiltre] = useState<FiltreKey>("tous");

  const commandesFiltrees = MOCK_COMMANDES.filter(
    (c) => filtre === "tous" || c.statut === filtre
  );

  const counts = {
    preparation: MOCK_COMMANDES.filter((c) => c.statut === "preparation").length,
    livraison: MOCK_COMMANDES.filter((c) => c.statut === "livraison").length,
    pret: MOCK_COMMANDES.filter((c) => c.statut === "pret").length,
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-sapin/60 uppercase tracking-widest mb-1">Récoltéo</p>
        <h1 className="text-2xl font-bold text-sapin">Suivi des collectes</h1>
        <p className="text-sm text-gray-500 mt-1">
          {MOCK_COMMANDES.length} commande{MOCK_COMMANDES.length > 1 ? "s" : ""} en cours
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "En préparation", count: counts.preparation, color: "text-peach", bg: "bg-peach/10", border: "border-peach" },
          { label: "En livraison", count: counts.livraison, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Prêts", count: counts.pret, color: "text-sapin", bg: "bg-sapin/10", border: "border-sapin" },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} border ${item.border} rounded-xl px-3 py-2.5 text-center`}>
            <p className={`text-xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {FILTRES.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltre(f.key as FiltreKey)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              filtre === f.key
                ? "bg-sapin text-cream shadow-sm"
                : "bg-white text-gray-500 border border-gray-200 hover:border-sapin/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {commandesFiltrees.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-400 text-sm"
            >
              Aucune commande dans cette catégorie
            </motion.div>
          ) : (
            commandesFiltrees.map((commande) => (
              <CarteCommande key={commande.id} commande={commande} />
            ))
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}