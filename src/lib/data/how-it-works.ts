export type IconName = "Gift" | "Users" | "FileText" | "MapPin" | "Send" | "CheckCircle";

export type StepDef = {
  icon: IconName;
  title: string;
  description: string;
};

export type ProfileDef = {
  role: string;
  subtitle: string;
  accent: "sapin" | "peach";
  cta: { label: string; href: string };
  steps: StepDef[];
};

export const profiles: ProfileDef[] = [
  {
    role: "Commerçant",
    subtitle: "Déposez vos invendus en quelques minutes",
    accent: "sapin",
    cta: { label: "Déposer un don", href: "/" },
    steps: [
      {
        icon: "Gift",
        title: "Je dépose mes invendus",
        description: "Renseignez la nature et la quantité de vos ressources disponibles en quelques clics.",
      },
      {
        icon: "Users",
        title: "Une association répond",
        description: "Les associations locales voient votre annonce et confirment le créneau de passage.",
      },
      {
        icon: "FileText",
        title: "Je reçois mon reçu CERFA",
        description: "Le formulaire fiscal est généré automatiquement et déductible de vos impôts.",
      },
    ],
  },
  {
    role: "Association",
    subtitle: "Trouvez des ressources autour de vous",
    accent: "peach",
    cta: { label: "Trouver des ressources", href: "/" },
    steps: [
      {
        icon: "MapPin",
        title: "Je cherche des ressources",
        description: "Parcourez les dons disponibles autour de vous par catégorie et par distance.",
      },
      {
        icon: "Send",
        title: "Je contacte le commerçant",
        description: "Confirmez le créneau de récupération directement depuis la plateforme.",
      },
      {
        icon: "CheckCircle",
        title: "Je remets le CERFA",
        description: "Signez le formulaire à la récupération. Tout est tracé, rien à imprimer.",
      },
    ],
  },
];