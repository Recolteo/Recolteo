"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "@deemlol/next-icons";
import { deleteAccount } from "@/src/app/login/actions";
import Button from "@/src/components/ui/Button";

const CONFIRM_WORD = "SUPPRIMER";

function ModalContent({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const confirmed = input === CONFIRM_WORD;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-200 bg-cream/40 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-201 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="pointer-events-auto w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-3xl border-2 border-sapin/10 shadow-[6px_6px_0_0_#04251c] overflow-hidden"
          initial={{ y: 60, scale: 0.97 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 40, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b-2 border-sapin/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-peach border border-peach shadow-[2px_2px_0_0_#d54a00] flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-cream" />
              </div>
              <h3 className="font-black text-sapin">Supprimer le compte</h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border-2 border-sapin/15 text-sapin flex items-center justify-center hover:bg-sapin hover:text-cream hover:border-sapin transition-all"
            >
              <X size={15} />
            </button>
          </div>

          <div className="px-6 py-6 flex flex-col gap-5">
            <div className="bg-peach/8 border border-peach/20 rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={16} className="text-peach shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="block font-black text-sapin">Cette action est irréversible.</span>
                <span className="block text-sapin/65 leading-snug">
                  Votre compte, toutes vos données et vos documents seront définitivement supprimés. Il n&apos;est pas possible de récupérer ces informations.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="font-bold text-sapin">
                Tapez{" "}
                <span className="font-black text-peach tracking-widest">{CONFIRM_WORD}</span>
                {" "}pour confirmer
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder={CONFIRM_WORD}
                className={`px-4 py-3.5 rounded-xl border-2 bg-white font-bold tracking-widest transition-colors focus:outline-none placeholder:text-sapin/20 placeholder:font-normal placeholder:tracking-normal ${
                  confirmed ? "border-peach text-peach" : "border-sapin/20 text-sapin focus:border-sapin"
                }`}
              />
            </div>

            <div className="flex gap-3">
              <Button label="Annuler" variant="sapin-outline" showArrow={false} onClick={onClose} className="flex-1 justify-center" />
              <Button
                label={isPending ? "Suppression…" : "Supprimer"}
                variant="peach"
                showArrow={false}
                disabled={!confirmed || isPending}
                onClick={() => startTransition(() => deleteAccount())}
                className="flex-1 justify-center"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function DeleteConfirmModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted] = useState(() => typeof window !== "undefined");
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>{isOpen && <ModalContent key="modal" onClose={onClose} />}</AnimatePresence>,
    document.body
  );
}
