"use client";

import { useEffect, useRef, useState } from "react";
import { X, MapPin, Package, Clock, Info, Truck } from "@deemlol/next-icons";
import Button from "@/src/components/ui/primitives/Button";
import { useCart } from "@/src/lib/cart-context";
import type { Lot } from "@/src/components/ui/cards/LotCard";

interface LotDetailModalProps {
  lot: Lot;
  showCartButton?: boolean;
  codeRetrait?: string | null;
  onClose: () => void;
}

const DRAG_THRESHOLD = 150;

function InfoCard({
  label,
  value,
  variant = "sapin",
}: {
  label: string;
  value: React.ReactNode;
  variant?: "sapin" | "peach" | "muted";
}) {
  if (variant === "peach") {
    return (
      <div className="bg-peach/4 border border-peach/10 rounded-2xl px-4 py-3">
        <p className="text-[10px] font-bold text-peach/60 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-lg font-black text-peach">{value}</p>
      </div>
    );
  }
  if (variant === "muted") {
    return (
      <div className="bg-sapin/4 border border-sapin/8 rounded-2xl px-4 py-3">
        <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-sapin/60">{value}</p>
      </div>
    );
  }
  return (
    <div className="bg-sapin/4 border border-sapin/8 rounded-2xl px-4 py-3">
      <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-lg font-black text-sapin">{value}</p>
    </div>
  );
}

export default function LotDetailModal({
  lot,
  showCartButton,
  codeRetrait,
  onClose,
}: LotDetailModalProps) {
  const { addToCart, items } = useCart();
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const startY = useRef(0);
  const inCart = items.some((i) => i.id_lot === lot.id_lot);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const dlc = lot.dlc
    ? new Date(lot.dlc).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const createdAt = new Date(lot.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const delta = e.touches[0].clientY - startY.current;
    setDragY(Math.max(0, delta));
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 sm:pt-20"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-cream/60 backdrop-blur-sm"
        style={{ opacity: backdropOpacity }}
      />

      <div
        className="relative z-10 w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-2xl border-2 border-sapin/10 shadow-[0_-4px_32px_0_color-mix(in_srgb,var(--color-sapin)_20%,transparent)] sm:shadow-[8px_8px_0_0_color-mix(in_srgb,var(--color-sapin)_15%,transparent)] overflow-hidden max-h-[80dvh] flex flex-col"
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
          className="px-5 py-4 border-b border-sapin/8 flex items-start justify-between gap-3 sm:touch-auto touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-start gap-3 min-w-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-lime/30 text-sapin border border-lime/50 shrink-0 mt-0.5">
              {lot.category}
            </span>
            <div className="min-w-0">
              <h2 className="font-black text-sapin text-base leading-tight">
                {lot.name_entreprise}
              </h2>
              <p className="text-xs text-sapin/50 mt-0.5 truncate">
                {lot.adresse}
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

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="bg-peach/6 border border-peach/12 rounded-2xl px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest mb-1">
                Valeur du don
              </p>
              <p className="text-2xl font-black text-peach leading-none">
                {lot.montant_chiffre.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
              <p className="text-xs text-sapin/40 mt-1 italic">
                {lot.montant_lettre}
              </p>
            </div>
          </div>

          {codeRetrait && (
            <div className="bg-lime/20 border-2 border-sapin/20 rounded-2xl px-4 py-4 flex flex-col items-center gap-1">
              <p className="text-[10px] font-bold text-sapin/50 uppercase tracking-widest">
                Code de retrait
              </p>
              <p className="text-3xl font-black text-sapin tracking-[0.35em]">
                {codeRetrait}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest flex items-center gap-1.5 px-2">
              <Package size={12} />
              Contenu du lot
            </p>
            <p className="text-sm text-sapin leading-relaxed font-medium px-2">
              {lot.nature}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Volume" value={`${lot.quantity} kg`} />
            {dlc ? (
              <InfoCard label="DLC" value={dlc} variant="peach" />
            ) : (
              <InfoCard label="Sans DLC" value="—" variant="muted" />
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest flex items-center gap-1.5 px-2">
              <MapPin size={12} />
              Adresse de récupération
            </p>
            <p className="text-sm text-sapin font-medium px-2">
              {lot.adresse_recup}
            </p>
          </div>

          {lot.instructions && (
            <div className="bg-lime/10 border border-lime/30 rounded-2xl px-4 py-3 space-y-1.5">
              <p className="text-[10px] font-bold text-sapin/60 uppercase tracking-widest flex items-center gap-1.5">
                <Info size={12} />
                Instructions
              </p>
              <p className="text-sm text-sapin/80 leading-relaxed">
                {lot.instructions}
              </p>
            </div>
          )}

          {lot.horaires && lot.horaires.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-sapin/40 uppercase tracking-widest flex items-center gap-1.5 px-2">
                <Truck size={12} />
                Disponibilités du commerçant
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {lot.horaires.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-sapin/6 border border-sapin/12 rounded-xl px-3 py-1.5 text-xs font-semibold text-sapin"
                  >
                    {h.jour} · {h.debut.replace(":", "h")}–
                    {h.fin.replace(":", "h")}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-sapin/40 px-2">
            <Clock size={12} />
            <span>Mis en ligne le {createdAt}</span>
          </div>
        </div>

        {showCartButton && (
          <div className="px-5 py-4 border-t border-sapin/8 bg-cream">
            <Button
              type="button"
              label={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
              variant={inCart ? "lime" : "sapin"}
              size="sm"
              showArrow={false}
              disabled={inCart}
              onClick={() => {
                addToCart(lot);
                onClose();
              }}
              className="w-full justify-center text-sm py-3"
            />
          </div>
        )}
      </div>
    </div>
  );
}
