export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Comment fonctionne Récoltéo ?",
    answer:
      "Récoltéo est une plateforme qui met en relation commerçants et associations. Le commerçant dépose une annonce pour ses invendus ; l'association intéressée prend contact et valide la collecte. La plateforme génère ensuite les documents légaux.",
  },
  {
    question: "Quelle est la réduction fiscale pour les commerçants ?",
    answer:
      "En faisant un don via Récoltéo, les commerçants bénéficient d'une réduction d'impôt allant jusqu'à 60 % de la valeur des produits donnés (dans la limite de 0,5 % du chiffre d'affaires). Récoltéo s'occupe de toute la documentation nécessaire.",
  },
  {
    question: "Comment est généré le CERFA ?",
    answer:
      "Dès que le don est confirmé entre les deux parties, Récoltéo génère automatiquement le formulaire CERFA 11580*03. Le document est disponible en téléchargement immédiat depuis le tableau de bord de l'association puis est envoyé au commercant lors de la validation de la collecte.",
  },
  {
    question: "Les dons sont-ils limités à l'alimentaire ?",
    answer:
      "Non ! Récoltéo accepte toutes les catégories : produits alimentaires, matériel de bureau, vêtements, mobilier, livres et jouets… Si un commerçant a des invendus, une association peut en bénéficier.",
  },
  {
    question: "Comment contacter le support ?",
    answer:
      "Pour toute question, vous pouvez nous écrire à digitalbylucie@gmail.com ou via notr formulaire de contact. Nous sommes là pour vous aider !",
  },
];
