export type UserType = "commercant" | "association";

export type DemoContent = {
  title: string;
  subtitle: string;
  src: string;
  points: string[];
};

export const demos: Record<UserType, DemoContent> = {
  commercant: {
    title: "Zéro friction,\nzéro paperasse",
    subtitle: "Du surplus déclaré à la déduction fiscale en moins de 3 minutes.",
    src: "/videos/demo-commercant.mp4",
    points: [
      "Déclarez vos invendus en quelques clics",
      "CERFA généré et transmis automatiquement",
      "Rapport fiscal exportable à tout moment",
    ],
  },
  association: {
    title: "Les dons,\npas la logistique",
    subtitle: "Concentrez-vous sur votre mission, on gère le reste.",
    src: "/videos/demo-association.mp4",
    points: [
      "Consultez les offres disponibles en temps réel",
      "Réservez et confirmez la collecte en un clic",
      "Historique complet de toutes vos collectes",
    ],
  },
};

export const tabs = [
  { value: "commercant", label: "Je suis commerçant" },
  { value: "association", label: "Je suis une association" },
];
