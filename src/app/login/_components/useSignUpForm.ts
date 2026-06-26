"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { signUp, type ActionState } from "../actions";
import {
  writeCookieConsent,
  readCookieConsent,
} from "@/src/lib/cookie-consent";

export type Role = "commercant" | "association";

export const ROLE_TABS = [
  { value: "commercant", label: "Commerçant" },
  { value: "association", label: "Association" },
];

export type Step1Data = {
  role: Role;
  nom: string;
  email: string;
  tel: string;
  password: string;
  confirmPassword: string;
};

export type Step2Data = {
  name_entreprise: string;
  rue: string;
  code_postal: string;
  ville: string;
  rna: string;
  type_asso_cat: string;
  type_asso: string;
  date_reconnaissance: string;
  date_jo: string;
  date_agrement: string;
  accept_geolocation: boolean;
  siret: string;
  type_activity: string;
  forme_juridique: string;
};

export type BanSuggestion = {
  label: string;
  rue: string;
  code_postal: string;
  ville: string;
};

const TEL_RE = /^(?:\+33|0033|0)[1-9]\d{8}$/;
const SIRET_RE = /^\d{14}$/;
const RNA_RE = /^W\d{9}$/i;

export function formatTel(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const parts = digits.match(/.{1,2}/g) ?? [];
  return parts.join(" ");
}

function captureStep2(form: HTMLFormElement): Step2Data {
  const fd = new FormData(form);
  return {
    name_entreprise: (fd.get("name_entreprise") as string) ?? "",
    rue: (fd.get("rue") as string) ?? "",
    code_postal: (fd.get("code_postal") as string) ?? "",
    ville: (fd.get("ville") as string) ?? "",
    rna: (fd.get("rna") as string) ?? "",
    type_asso_cat: (fd.get("type_asso_cat") as string) ?? "",
    type_asso: (fd.get("type_asso") as string) ?? "",
    date_reconnaissance: (fd.get("date_reconnaissance") as string) ?? "",
    date_jo: (fd.get("date_jo") as string) ?? "",
    date_agrement: (fd.get("date_agrement") as string) ?? "",
    accept_geolocation: fd.get("accept_geolocation") === "on",
    siret: (fd.get("siret") as string) ?? "",
    type_activity: (fd.get("type_activity") as string) ?? "",
    forme_juridique: (fd.get("forme_juridique") as string) ?? "",
  };
}

export function useSignUpForm() {
  const [state, action, pending] = useActionState(signUp, {} as ActionState);
  const [step, setStep] = useState<1 | 2>(1);
  const [s1, setS1] = useState<Step1Data>({
    role: "commercant",
    nom: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
  });
  const [s2, setS2] = useState<Step2Data>({
    name_entreprise: "",
    rue: "",
    code_postal: "",
    ville: "",
    rna: "",
    type_asso_cat: "",
    type_asso: "",
    date_reconnaissance: "",
    date_jo: "",
    date_agrement: "",
    accept_geolocation: false,
    siret: "",
    type_activity: "",
    forme_juridique: "",
  });
  const [telDisplay, setTelDisplay] = useState(() =>
    s1.tel ? formatTel(s1.tel) : "",
  );
  const [acceptsCgu, setAcceptsCgu] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const [banSuggestions, setBanSuggestions] = useState<BanSuggestion[]>([]);
  const step2FormRef = useRef<HTMLFormElement>(null);
  const banTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const isTelError = !!state.error?.includes("téléphone");
  const isAsso = s1.role === "association";

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setBanSuggestions([]);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!isTelError || !step2FormRef.current) return;
    setS2(captureStep2(step2FormRef.current));
    setLocalError(state.error);
    setStep(1);
  }, [state.error, isTelError]);

  async function fetchBanSuggestions(query: string) {
    if (query.length < 4) {
      setBanSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BAN_GEOCODE_URL}?q=${encodeURIComponent(query)}&limit=5&type=housenumber`,
      );
      const data: {
        features: {
          properties: {
            label: string;
            housenumber?: string;
            street?: string;
            name?: string;
            postcode: string;
            city: string;
          };
        }[];
      } = await res.json();
      setBanSuggestions(
        data.features.map((f) => ({
          label: f.properties.label,
          rue: [
            f.properties.housenumber,
            f.properties.street ?? f.properties.name,
          ]
            .filter(Boolean)
            .join(" "),
          code_postal: f.properties.postcode,
          ville: f.properties.city,
        })),
      );
    } catch {
      setBanSuggestions([]);
    }
  }

  function handleRueChange(val: string) {
    setS2((p) => ({ ...p, rue: val }));
    if (banTimeoutRef.current) clearTimeout(banTimeoutRef.current);
    banTimeoutRef.current = setTimeout(() => fetchBanSuggestions(val), 350);
  }

  function handleSelectSuggestion(s: BanSuggestion) {
    setS2((p) => ({
      ...p,
      rue: s.rue,
      code_postal: s.code_postal,
      ville: s.ville,
    }));
    setBanSuggestions([]);
  }

  function handleStep1(e: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Step1Data = {
      role: s1.role,
      nom: fd.get("nom") as string,
      email: fd.get("email") as string,
      tel: fd.get("tel") as string,
      password: fd.get("password") as string,
      confirmPassword: fd.get("confirmPassword") as string,
    };

    const telNorm = data.tel.replace(/[\s.\-()]/g, "");
    if (!TEL_RE.test(telNorm)) {
      setLocalError("Numéro de téléphone invalide (ex : 06 12 34 56 78).");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (data.password.length < 8) {
      setLocalError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLocalError(undefined);
    setS1({ ...data, tel: telNorm });
    setStep(2);
  }

  function handleBack() {
    if (step2FormRef.current) setS2(captureStep2(step2FormRef.current));
    setLocalError(undefined);
    setStep(1);
  }

  function handleStep2(e: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const rue = (fd.get("rue") as string).trim();
    const ville = (fd.get("ville") as string).trim();
    fd.set("adresse", `${rue}, ${ville}`);

    const cp = (fd.get("code_postal") as string).trim();
    if (cp && !/^\d{5}$/.test(cp)) {
      setLocalError("Le code postal doit contenir exactement 5 chiffres.");
      return;
    }

    if (isAsso) {
      const rna = (fd.get("rna") as string).trim().toUpperCase();
      if (!RNA_RE.test(rna)) {
        setLocalError(
          "Le numéro RNA doit commencer par W suivi de 9 chiffres (ex : W751000000).",
        );
        return;
      }
      fd.set("rna", rna);
    } else {
      const siret = (fd.get("siret") as string).replace(/\s/g, "");
      if (!SIRET_RE.test(siret)) {
        setLocalError("Le SIRET doit contenir exactement 14 chiffres.");
        return;
      }
      fd.set("siret", siret);
    }

    if (!acceptsCgu) {
      setLocalError(
        "Veuillez accepter les CGU et la politique de confidentialité pour continuer.",
      );
      return;
    }

    setLocalError(undefined);

    if (isAsso) {
      const current = readCookieConsent();
      writeCookieConsent({
        ...current,
        geolocalisation: s2.accept_geolocation,
        consented: true,
      });
    }

    fd.append("password", s1.password);
    fd.append("confirmPassword", s1.confirmPassword);
    startTransition(() => action(fd));
  }

  return {
    state,
    pending,
    step,
    s1,
    setS1,
    s2,
    setS2,
    telDisplay,
    setTelDisplay,
    acceptsCgu,
    setAcceptsCgu,
    localError,
    banSuggestions,
    step2FormRef,
    suggestionsRef,
    isTelError,
    isAsso,
    handleStep1,
    handleStep2,
    handleBack,
    handleRueChange,
    handleSelectSuggestion,
  };
}
