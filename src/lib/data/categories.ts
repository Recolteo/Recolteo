export type Pill = {
  label: string;
  color: string;
  rotate: number;
};

export const categoryRows: Pill[][] = [
  [
    { label: "Invendus alimentaires", color: "bg-lime text-sapin", rotate: -4 },
    { label: "Matériel de bureau", color: "bg-sapin text-cream", rotate: 3 },
  ],
  [
    { label: "Associations locales", color: "bg-peach text-cream", rotate: -3 },
    { label: "Produits frais", color: "bg-lime text-sapin", rotate: 5 },
  ],
  [
    { label: "Livres & Jouets", color: "bg-sapin text-cream", rotate: -5 },
    {
      label: "Équipements",
      color: "bg-cream text-sapin border border-sapin/20",
      rotate: 2,
    },
  ],
  [
    { label: "Dons de vêtements", color: "bg-peach text-cream", rotate: -3 },
    { label: "Matières premières", color: "bg-sapin text-cream", rotate: 4 },
  ],
  [
    {
      label: "Mobilier",
      color: "bg-cream text-sapin border border-sapin/20",
      rotate: -4,
    },
    { label: "Autres ressources", color: "bg-lime text-sapin", rotate: 3 },
  ],
];
