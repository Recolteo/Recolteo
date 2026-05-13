export type AboutValueKey = "Zap" | "TrendingUp" | "Shield" | "Heart";

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutValue = {
  icon: AboutValueKey;
  title: string;
  description: string;
};

export const aboutStats: AboutStat[] = [
  { value: "500+", label: "échanges réalisés" },
  { value: "150+", label: "commerçants engagés" },
  { value: "80+", label: "associations partenaires" },
];

export const aboutValues: AboutValue[] = [
  {
    icon: "Zap",
    title: "Simplicité avant tout",
    description:
      "De la déclaration d'invendu à la remise du CERFA, tout se passe en quelques clics. Zéro paperasse, zéro friction.",
  },
  {
    icon: "TrendingUp",
    title: "Un impact mesurable",
    description:
      "Chaque don est traçable. Vous savez exactement à qui ça profite, combien ça représente, et ce que ça vous rapporte fiscalement.",
  },
  {
    icon: "Shield",
    title: "Conformité garantie",
    description:
      "Récoltéo génère automatiquement les documents légaux requis avec un formulaire CERFA personnalisé, sans erreur ni délai.",
  },
  {
    icon: "Heart",
    title: "Solidarité concrète",
    description:
      "Chaque don crée un lien direct entre votre commerce et des associations locales. Votre surplus nourrit des familles, pas des poubelles.",
  },
];
