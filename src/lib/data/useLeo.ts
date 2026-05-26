import { useState, useEffect } from "react";

interface LeoStep {
  message: string;
}

interface UseLeoOptions {
  storageKey: string;
  steps: LeoStep[];
}

export function useLeo({ storageKey, steps }: UseLeoOptions) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      setShow(true);
    } else {
      setHasSeen(true);
    }
  }, [storageKey]);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(storageKey, "true");
    setTimeout(() => setHasSeen(true), 700);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setVisible(false);
      setTimeout(() => {
        setStep((s) => s + 1);
        setVisible(true);
      }, 250);
    } else {
      dismiss();
    }
  };

  return {
    step,
    show,
    hasSeen,
    visible,
    isLastStep: step === steps.length - 1,
    currentMessage: steps[step].message,
    totalSteps: steps.length,
    dismiss,
    next,
  };
}