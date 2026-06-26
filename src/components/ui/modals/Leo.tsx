"use client";

import Image from "next/image";
import { useState, useEffect, useSyncExternalStore } from "react";
import { AnimatePresence } from "motion/react";
import Ecureuil from "@/src/asset/ecureuil.webp";
import Button from "@/src/components/ui/primitives/Button";
import StepDots from "@/src/components/ui/primitives/StepDots";
import Reveal from "@/src/components/animations/Reveal";
import SlideIn from "@/src/components/animations/SlideIn";
import FadeOut from "@/src/components/animations/FadeOut";

export interface LeoProps {
  storageKey?: string;
  steps: { message: string }[];
}

export default function Leo({
  storageKey = "recolteo_leo_seen_v1",
  steps,
}: LeoProps) {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const seen = useSyncExternalStore(
    () => () => {},
    () => !!localStorage.getItem(storageKey),
    () => false,
  );
  const show = !seen && !dismissed;
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);
  const dismiss = () => {
    localStorage.setItem(storageKey, "1");
    setDismissed(true);
  };
  const next = () =>
    step < steps.length - 1 ? setStep((s) => s + 1) : dismiss();
  const isLast = step === steps.length - 1;

  return (
    <AnimatePresence>
      {show && (
        <FadeOut className="fixed inset-0 z-60">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={next}
          />
          <div className="fixed bottom-0 inset-x-0 z-60">
            <Reveal>
              <div className="relative z-20 w-full bg-cream border-t-2 border-sapin shadow-2xl">
                <div className="px-4 sm:px-8 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="inline-flex items-center gap-2 bg-sapin rounded-full px-4 py-1">
                      <span className="text-cream font-semibold text-sm tracking-wide">
                        {"Léo"}
                      </span>
                    </div>
                    <StepDots
                      count={steps.length}
                      current={step}
                      onGoTo={setStep}
                    />
                  </div>
                  <p className="text-sapin italic leading-relaxed py-3 my-1 pr-28 sm:pr-56">
                    {steps[step]?.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <h2 className="text-sapin font-bold text-xl">
                      {"Récoltéo"}
                    </h2>
                    <Button
                      label={isLast ? "Terminer" : "Suivant"}
                      onClick={next}
                      variant="sapin"
                      size="sm"
                      showArrow={!isLast}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
            <div
              className="z-10 absolute right-2 sm:right-24 pointer-events-none"
              style={{ bottom: "100%", marginBottom: "-44px" }}
            >
              <SlideIn direction="right" delay={0.3}>
                <Image
                  src={Ecureuil}
                  alt={"écureuil Récoltéo"}
                  width={280}
                  height={280}
                  className="object-contain w-28 sm:w-56"
                />
              </SlideIn>
            </div>
          </div>
        </FadeOut>
      )}
    </AnimatePresence>
  );
}
