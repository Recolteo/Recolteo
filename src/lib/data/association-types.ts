export const ASSO_CATEGORIES = [
  { value: "association", label: "Association" },
  { value: "fondation", label: "Fondation" },
  { value: "etablissement", label: "Établissement d'enseignement" },
  { value: "organisme", label: "Organisme ou société" },
];

export const ASSO_TYPE_MAP: Record<string, { value: string; label: string }[]> =
  {
    association: [
      { value: "loi_1901", label: "Association loi 1901" },
      {
        value: "aide_alimentaire",
        label:
          "Aide alimentaire, soins médicaux ou produits de première nécessité",
      },
      {
        value: "cultuelle",
        label: "Cultuelle ou établissement public des cultes d'Alsace-Moselle",
      },
      {
        value: "utilite_publique",
        label: "Reconnue d'utilité publique par décret",
      },
    ],
    fondation: [
      {
        value: "universitaire",
        label: "Universitaire ou partenariale (art. L.719-12 et L.719-13)",
      },
      { value: "entreprise", label: "D'entreprise" },
      { value: "fonds_dotation", label: "Fonds de dotation" },
      {
        value: "patrimoine",
        label:
          "Du patrimoine — subventionnant des travaux sur monuments historiques",
      },
    ],
    etablissement: [
      {
        value: "ens_sup",
        label:
          "Enseignement supérieur ou artistique, public ou privé, d'intérêt général, à but non lucratif",
      },
      {
        value: "ens_consulaire",
        label:
          "Enseignement supérieur consulaire (art. L. 711-17 du code de commerce)",
      },
    ],
    organisme: [
      { value: "musee", label: "Musée de France" },
      {
        value: "gestion_arts",
        label:
          "Gestion désintéressée — présentation d'œuvres dramatiques, lyriques, musicales, chorégraphiques, cinématographiques, audiovisuelles, de cirque ou expositions d'art contemporain",
      },
      {
        value: "these_doctorat",
        label:
          "Mécénat de doctorat — projet de thèse proposé par une école doctorale",
      },
      {
        value: "etat_actionnaire",
        label:
          "Société dont l'État est l'actionnaire unique (expositions universelles)",
      },
      {
        value: "snp_culturel",
        label:
          "Société nationale de programme — audiovisuel culturel (art. 44, loi n° 86-1067)",
      },
      {
        value: "snp_musical",
        label:
          "Société nationale de programme — formations musicales (III art. 44, loi n° 86-1067)",
      },
      {
        value: "agree_budget",
        label:
          "Agréé par le ministre du budget (art. 4, ord. n° 58-882 du 25 sept. 1958)",
      },
    ],
  };

export const ASSO_TYPE_LABELS: Record<string, string> = {
  loi_1901: "Association loi 1901",
  utilite_publique:
    "Association ou fondation reconnue d'utilité publique par décret",
  aide_alimentaire:
    "Organismes sans but lucratif fournissant gratuitement une aide alimentaire, des soins médicaux ou des produits de première nécessité à des personnes en difficulté ou favorisant leur logement",
  cultuelle:
    "Association cultuelle ou établissement public des cultes reconnus d'Alsace-Moselle",
  universitaire:
    "Fondation universitaire ou fondation partenariale mentionnées respectivement aux articles L.719-12 et L.719-13 du code de l'éducation",
  entreprise: "Fondation d'entreprise",
  patrimoine:
    "Fondation du patrimoine ou fondation ou association reconnue d'utilité publique qui subventionne des travaux sur des monuments historiques dans le cadre des conventions prévues à l'article L.143-2-1 et L. 143-15 du code du patrimoine",
  fonds_dotation: "Fonds de dotation",
  ens_sup:
    "Établissement d'enseignement supérieur ou d'enseignement artistique public ou privé, d'intérêt général, à but non lucratif",
  ens_consulaire:
    "Établissement d'enseignement supérieur consulaire mentionné à l'article L. 711-17 du code de commerce",
  musee: "Musée de France",
  gestion_arts:
    "Organisme public ou privé dont la gestion est désintéressée et qui a pour activité principale la présentation au public d'œuvres dramatiques, lyriques, musicales, chorégraphiques, cinématographiques, audiovisuelles et de cirque ou l'organisation d'expositions d'art contemporain",
  agree_budget:
    "Société ou organisme public ou privé agréé par le ministre chargé du budget en vertu de l'article 4 de l'ordonnance n° 58-882 du 25 septembre 1958 relative à la fiscalité en matière de recherche scientifique et technique",
  these_doctorat:
    "Projet de thèse proposé au mécénat de doctorat par une école doctorale",
  etat_actionnaire:
    "Société, dont l'État est l'actionnaire unique, qui a pour activité la représentation de la France aux expositions universelles",
  snp_culturel:
    "Société nationale de programme mentionnée à l'article 44 de la loi n° 86-1067 du 30 septembre 1986 relative à la liberté de communication et affectés au financement de programmes audiovisuels culturels",
  snp_musical:
    "Société nationale de programme mentionnée au III de l'article 44 de la loi n° 86-1067 du 30 septembre 1986 relative à la liberté de communication et affectés au financement des activités des formations musicales dont elle assure la gestion et le développement",
};
