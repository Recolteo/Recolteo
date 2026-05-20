import Reveal from "@/src/components/animations/Reveal";

export const metadata = {
  title: "Politique de gestion des cookies — Récoltéo",
  description:
    "Découvrez comment Récoltéo utilise les cookies, quelles données sont collectées et comment gérer vos préférences conformément au RGPD et aux recommandations de la CNIL.",
};

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-base leading-8 text-sapin">
      <Reveal delay={0.5}>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-sapin mb-10">
          Politique de gestion des cookies
        </h1>
        <p className="mb-6">
          La présente politique a pour objet d'informer les utilisateurs de la
          plateforme Récoltéo sur l'utilisation des cookies et technologies
          similaires, conformément aux exigences du Règlement Général sur la
          Protection des Données (RGPD) et aux recommandations de la Commission
          Nationale de l'Informatique et des Libertés (CNIL).
        </p>
      </Reveal>

      <Reveal delay={0.65}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">
            1. Qu'est-ce qu'un cookie ?
          </h2>
          <p className="mb-3">
            Un cookie est un petit fichier texte déposé sur votre terminal
            (ordinateur, tablette, smartphone) lors de votre visite sur un site
            web. Il permet au site de mémoriser des informations relatives à
            votre navigation pour une durée déterminée.
          </p>
          <p className="mb-3">
            Les cookies ne peuvent pas exécuter de programmes ni introduire de
            virus sur votre appareil. Ils sont strictement associés au navigateur
            que vous utilisez et ne contiennent aucune donnée permettant de vous
            identifier directement.
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.8}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">
            2. Cookies utilisés par Récoltéo
          </h2>
          <p className="mb-4">
            Récoltéo n'utilise aucun cookie à des fins publicitaires ou de
            ciblage commercial. Les cookies déposés relèvent uniquement des
            catégories suivantes :
          </p>

          <div className="space-y-6">
            <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-sapin">Cookies nécessaires</h3>
                <span className="text-xs bg-lime text-sapin font-semibold px-2 py-0.5 rounded-full">
                  Toujours actifs
                </span>
              </div>
              <p className="text-sm text-sapin/70 mb-3">
                Ces cookies sont indispensables au fonctionnement du site. Ils
                assurent la sécurité des sessions, l'authentification et le bon
                déroulement des fonctionnalités essentielles. Ils ne peuvent pas
                être désactivés.
              </p>
              <table className="w-full text-xs text-sapin/70 border-collapse">
                <thead>
                  <tr className="border-b border-sapin/10">
                    <th className="text-left py-1 pr-4 font-semibold">Nom</th>
                    <th className="text-left py-1 pr-4 font-semibold">Finalité</th>
                    <th className="text-left py-1 font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sapin/5">
                    <td className="py-1.5 pr-4 font-mono">sb-*</td>
                    <td className="py-1.5 pr-4">Session Supabase (authentification)</td>
                    <td className="py-1.5">Session</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-4 font-mono">_rc</td>
                    <td className="py-1.5 pr-4">Mémorisation de vos préférences cookies</td>
                    <td className="py-1.5">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40">
              <h3 className="font-bold text-sapin mb-2">Cookies analytiques</h3>
              <p className="text-sm text-sapin/70 mb-3">
                Ces cookies, déposés uniquement avec votre consentement, nous
                permettent de mesurer l'audience du site et d'en améliorer les
                performances (pages les plus visitées, parcours utilisateur,
                erreurs rencontrées). Les données collectées sont anonymisées et
                ne permettent pas de vous identifier individuellement.
              </p>
              <p className="text-xs text-sapin/50 italic">
                Aucun cookie analytique n'est déposé sans votre accord préalable.
              </p>
            </div>

            <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40">
              <h3 className="font-bold text-sapin mb-2">Cookies fonctionnels</h3>
              <p className="text-sm text-sapin/70 mb-3">
                Ces cookies, déposés uniquement avec votre consentement,
                mémorisent vos préférences d'affichage et de navigation (filtres
                actifs, paramètres d'interface) afin d'améliorer votre
                expérience. Aucune donnée n'est transmise à des tiers.
              </p>
              <p className="text-xs text-sapin/50 italic">
                Aucun cookie fonctionnel n'est déposé sans votre accord préalable.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.95}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">
            3. Durée de conservation
          </h2>
          <p className="mb-3">
            Conformément aux recommandations de la CNIL, la durée de validité du
            consentement est fixée à <strong>12 mois</strong>. Passé ce délai,
            votre accord vous sera de nouveau demandé.
          </p>
          <p className="mb-3">
            Les cookies de session (nécessaires) sont automatiquement supprimés à
            la fermeture de votre navigateur.
          </p>
        </section>
      </Reveal>

      <Reveal delay={1.1}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">
            4. Gérer vos préférences
          </h2>
          <p className="mb-3">
            Vous pouvez modifier vos préférences à tout moment en cliquant sur
            l'icône cookie <span className="font-semibold">( 🍪 )</span> située
            en bas à gauche de chaque page, ou via les réglages de votre
            navigateur.
          </p>
          <p className="mb-3">
            Le retrait de votre consentement ne remet pas en cause la licéité du
            traitement effectué avant ce retrait.
          </p>
          <ul className="space-y-2 mt-4 text-sm">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-sapin/70 transition-colors"
              >
                Google Chrome — gérer les cookies
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-sapin/70 transition-colors"
              >
                Mozilla Firefox — gérer les cookies
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-sapin/70 transition-colors"
              >
                Safari — gérer les cookies
              </a>
            </li>
          </ul>
        </section>
      </Reveal>

      <Reveal delay={1.25}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">
            5. Vos droits
          </h2>
          <p className="mb-3">
            Conformément au RGPD, vous disposez des droits suivants concernant
            vos données personnelles :
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm mb-4">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit d'opposition</li>
            <li>Droit au retrait du consentement à tout moment</li>
          </ul>
          <p className="mb-3">
            Pour exercer ces droits, contactez-nous à l'adresse :{" "}
            <a
              href="mailto:digitalbylucie@gmail.com"
              className="underline hover:text-sapin/70 transition-colors"
            >
              digitalbylucie@gmail.com
            </a>
          </p>
          <p className="text-sm text-sapin/60">
            Vous avez également le droit d'introduire une réclamation auprès de
            la CNIL :{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sapin/70 transition-colors"
            >
              www.cnil.fr
            </a>
          </p>
        </section>
      </Reveal>

      <Reveal delay={1.4}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">
            6. Contact
          </h2>
          <p className="mb-3">
            Pour toute question relative à cette politique ou à l'utilisation de
            vos données, vous pouvez nous contacter :
          </p>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>Responsable :</strong> Lucie Curtatone — Récoltéo
            </li>
            <li>
              <strong>Adresse :</strong> 6 rue du Bac, 38190 Villard Bonnot
            </li>
            <li>
              <strong>Email :</strong>{" "}
              <a
                href="mailto:digitalbylucie@gmail.com"
                className="underline hover:text-sapin/70 transition-colors"
              >
                digitalbylucie@gmail.com
              </a>
            </li>
          </ul>
        </section>
      </Reveal>

      <Reveal delay={1.55}>
        <p className="text-xs text-sapin/40 border-t border-sapin/10 pt-6">
          Dernière mise à jour : mai 2026 — Cette politique peut être modifiée à
          tout moment. La version en vigueur est celle publiée sur cette page.
        </p>
      </Reveal>
    </main>
  );
}
