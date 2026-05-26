"use client";

import Image from "next/image";
import Ecureuil from "@/src/asset/ecureuil.webp";
import { motion, AnimatePresence } from "motion/react";
import { useLeo } from "@/src/lib/data/useLeo";

interface LeoProps {
  storageKey: string;
  steps: { message: string }[];
}

export default function Leo({ storageKey, steps }: LeoProps) {
  const { step, show, hasSeen, visible, isLastStep, currentMessage, totalSteps, dismiss, next } =
    useLeo({ storageKey, steps });

  if (hasSeen) return null;

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-40 cursor-pointer bg-black/10" onClick={next} />
      )}

      <div
        className={`fixed bottom-3 left-3 right-3 z-50 transition-all duration-700 ease-in-out
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: "easeOut" }}
          className="relative z-20 w-full bg-amber-50 border-2 border-sapin rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-8 py-5">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-2 bg-sapin rounded-full px-4 py-1">
                <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span className="text-amber-50 font-semibold text-sm tracking-wide">Léo</span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? "w-6 bg-sapin" : "w-1.5 bg-sapin/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <AnimatePresence mode="wait">
                {visible && (
                  <motion.p
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sapin text-lg leading-relaxed font-medium max-w-2xl"
                  >
                    {currentMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                onClick={(e) => { e.stopPropagation(); dismiss(); }}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full border-2 border-sapin/40 text-sapin hover:bg-sapin hover:text-amber-50 transition-all duration-200 cursor-pointer text-sm font-bold z-30"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-sapin/50 text-xs italic">Cliquez n'importe où pour continuer...</p>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="flex items-center gap-1.5 bg-sapin text-amber-50 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-sapin/80 transition-all duration-200 cursor-pointer"
              >
                {isLastStep ? "Terminer" : "Suivant"}
                {!isLastStep && <span>→</span>}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, ease: "easeOut" }}
          className="z-10 absolute right-4 sm:right-32"
          style={{ bottom: "100%", marginBottom: "-60px" }}
        >
          <Image
            src={Ecureuil}
            alt="écureuil Récoltéo"
            width={270}
            height={270}
            className="object-contain w-[180px] sm:w-[270px]"
          />
        </motion.div>
      </div>
    </>
  );
}