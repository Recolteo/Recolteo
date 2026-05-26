"use client";

import LoginForm from "./_components/LoginForm";
import Image from "next/image";
import Ecureuil from "@/src/asset/ecureuil.webp";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [showMascot, setShowMascot] = useState(false);
  const [hasSeenMascot, setHasSeenMascot] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenMascot");
    if (!seen) {
      setShowMascot(true);
    } else {
      setHasSeenMascot(true);
    }
  }, []);

  useEffect(() => {
    if (showMascot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMascot]);

  const handleDismiss = () => {
    setShowMascot(false);
    localStorage.setItem("hasSeenMascot", "true");
    setTimeout(() => setHasSeenMascot(true), 700);
  };

  return (
    <main className="relative w-full flex flex-col sm:flex-row items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-2 sm:py-10 gap-1 overflow-hidden">

      <LoginForm />

      {showMascot && (
        <div
          className="fixed inset-0 z-40 cursor-pointer"
          onClick={handleDismiss}
        />
      )}

      {!hasSeenMascot && (
        <div
          className={`fixed bottom-3 left-3 right-3 z-50 transition-all duration-700 ease-in-out
            ${showMascot ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: "easeOut" }}
            className="relative z-20 w-full bg-amber-50 border-2 border-sapin rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-5">
              <div className="inline-flex items-center gap-2 bg-sapin rounded-full px-4 py-1 mb-3">
                <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                <span className="text-amber-50 font-semibold text-sm tracking-wide">Léo</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-sapin text-lg leading-relaxed font-medium max-w-2xl">
                  Bienvenue sur Récoltéo, accédez à votre espace.
                </p>

                <button
                  onClick={handleDismiss}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full border-2 border-sapin/40 text-sapin hover:bg-sapin hover:text-amber-50 transition-all duration-200 cursor-pointer text-sm font-bold z-30"
                >
                  ✕
                </button>
              </div>

              <p className="text-sapin/50 text-xs mt-3 italic">Cliquez n'importe où pour continuer...</p>
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
      )}
    </main>
  );
}