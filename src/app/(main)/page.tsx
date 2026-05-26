"use client";

import Hero from "@/src/components/sections/Hero";
import Categories from "@/src/components/sections/Categories";
import HowItWorks from "@/src/components/sections/HowItWorks";
import Image from "next/image";
import Ecureuil from "@/src/asset/ecureuil.webp";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const TUTORIAL_STEPS = [
  {
    section: "Hero",
    message: "Bienvenue sur Récoltéo ! Ici, commerçants et associations de votre région échangent simplement. Découvrez comment ça fonctionne !",
  },
  {
    section: "Categories",
    message: "Explorez les catégories disponibles : alimentaire, bien-être, culture… Chaque commerçant propose ce qu'il fait de mieux !",
  },
  {
    section: "HowItWorks",
    message: "3 étapes simples pour profiter des offres près de chez vous. Inscrivez-vous, choisissez, récupérez. C'est tout ! 🐿️",
  },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [showTuto, setShowTuto] = useState(false);
  const [hasSeenTuto, setHasSeenTuto] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenHomeTuto");
    if (!seen) {
      setShowTuto(true);
    } else {
      setHasSeenTuto(true);
    }
  }, []);

  useEffect(() => {
    if (showTuto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTuto]);

  const handleDismiss = () => {
    setShowTuto(false);
    localStorage.setItem("hasSeenHomeTuto", "true");
    setTimeout(() => setHasSeenTuto(true), 700);
  };

  const handleNext = () => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setVisible(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setVisible(true);
      }, 250);
    } else {
      handleDismiss();
    }
  };

  const isLastStep = step === TUTORIAL_STEPS.length - 1;

  return (
    <main>
      <Hero
        title="Votre réseau"
        subtitle="qui échange"
        labelTitle="vraiment"
        spanTitle="proche"
        endTitle="de chez vous"
        description="Recolteo connecte commerçants et associations pour une solidarité simple et rapide. Une action où tout le monde y gagne."
        primaryButton="Explorer la plateforme"
        primaryButtonHref="./decouvrir-recolteo"
        secondaryButton="Profiter des offres"
        secondaryButtonHref="./lots"
      />
      <Categories />
      <HowItWorks />

      {/* Overlay */}
      {showTuto && (
        <div
          className="fixed inset-0 z-40 cursor-pointer bg-black/10"
          onClick={handleNext}
        />
      )}

      {/* Bloc tuto Léo */}
      {!hasSeenTuto && (
        <div
          className={`fixed bottom-3 left-3 right-3 z-50 transition-all duration-700 ease-in-out
            ${showTuto ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`}
        >
          {/* Bulle */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: "easeOut" }}
            className="relative z-20 w-full bg-amber-50 border-2 border-sapin rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-5">
              {/* Badge + indicateur d'étape */}
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-2 bg-sapin rounded-full px-4 py-1">
                  <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                  <span className="text-amber-50 font-semibold text-sm tracking-wide">Léo</span>
                </div>
                <div className="flex gap-1.5">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step ? "w-6 bg-sapin" : "w-1.5 bg-sapin/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Message animé */}
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
                      {TUTORIAL_STEPS[step].message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full border-2 border-sapin/40 text-sapin hover:bg-sapin hover:text-amber-50 transition-all duration-200 cursor-pointer text-sm font-bold z-30"
                >
                  ✕
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3">
                <p className="text-sapin/50 text-xs italic">Cliquez n'importe où pour continuer...</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="flex items-center gap-1.5 bg-sapin text-amber-50 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-sapin/80 transition-all duration-200 cursor-pointer"
                >
                  {isLastStep ? "Terminer" : "Suivant"}
                  {!isLastStep && <span>→</span>}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Écureuil */}
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
      )}
    </main>
  );
}
