import Reveal from "@/src/components/animations/Reveal";

export default function PolitiqueDeConfidentialite() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-base leading-8 text-sapin">
      <Reveal delay={0.5}>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-sapin mb-10">Politique de confidentialité</h1>

      <p className="mb-3">
        La présente politique de confidentialité a pour objectif d’informer les utilisateurs de la plateforme Récoltéo sur la manière dont leurs données personnelles sont collectées, utilisées et protégées. Récoltéo est une plateforme mettant en relation des commerces et des associations afin de faciliter le don d’invendus alimentaires ou matériels. Récoltéo s’engage à respecter la réglementation applicable en matière de protection des données personnelles, notamment le Règlement Général sur la Protection des Données (RGPD) applicable aux utilisateurs situés dans l’Union européenne.
      </p>
      </Reveal>

      <Reveal delay={0.75}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">1. Responsable du traitement</h2>
        <ul>
          <li className="mb-3">Le responsable du traitement des données est :</li>
          <li className="mb-3">Récoltéo</li>
          <li className="mb-3">Responsable : Lucie Curtatone</li>
          <li className="mb-3">Adresse : 6 rue du Bac, 38190 Villard Bonnot</li>
          <li
            className="mb-3">Mail : {" "}
            <a href="mailto:digitalbylucie@gmail.com" className="underline hover:text-sapin">
              digitalbylucie@gmail.com
            </a>
          </li>
          <li className="mb-3">Plateforme : Récoltéo</li>
        </ul>
      </section>
      </Reveal>

      <Reveal delay={1.0}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">2. Hébergement</h2>
        <p className="mb-3">La plateforme Récoltéo est hébergée par : Vercel Inc. 440 N Barranca Ave #4133 Covina, CA 91723 États Unis.</p>
        <p className="mb-3">Les données peuvent être hébergées ou transférées en dehors de l’Union européenne. Dans ce cas, Vercel met en place des garanties conformes au RGPD, notamment les clauses contractuelles types approuvées par la Commission européenne.</p>
      </section>
      </Reveal>

      <Reveal delay={0.5}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">3. Délégué à la protection des données</h2>
        <p className="mb-3">Récoltéo n’est pas tenu de désigner un Délégué à la Protection des Données (DPO).</p>
      </section>
      </Reveal>

      <Reveal delay={0.75}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">4. Données collectées</h2>
        <p className="mb-3">Dans le cadre de l’utilisation de la plateforme, Récoltéo peut collecter les données suivantes :</p>
        <div>
          <div>
            <p className="mb-3">Données d’identification</p>
            <ul>
              <li className="mb-3">Nom</li>
              <li className="mb-3">Prénom</li>
              <li className="mb-3">Adresse email</li>
              <li className="mb-3">Adresse postale</li>
            </ul>
          </div>

          <div>
            <p className="mb-3">Données professionnelles</p>
            <ul>
              <li className="mb-3">Nom de l’entreprise</li>
              <li className="mb-3">Numéro SIRET</li>
              <li className="mb-3">Informations relatives à l’activité professionnelle</li>
            </ul>
          </div>

          <div>
            <p className="mb-3">Données de compte</p>
            <ul>
              <li className="mb-3">Identifiants de connexion</li>
              <li className="mb-3">Informations de profil utilisateur</li>
              <li className="mb-3">Historique des interactions sur la plateforme</li>
            </ul>
          </div>

          <div>
            <p className="mb-3">Données techniques</p>
            <ul>
              <li className="mb-3">Adresse IP</li>
              <li className="mb-3">Données de connexion</li>
              <li className="mb-3">Cookies techniques nécessaires au fonctionnement du site</li>
            </ul>
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal delay={1.0}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">5. Finalités du traitement</h2>
        <p className="mb-3">Les données personnelles sont collectées afin de :</p>
        <ul>
          <li className="mb-3">créer et gérer les comptes utilisateurs ;</li>
          <li className="mb-3">permettre la mise en relation entre commerces et associations ;</li>
          <li className="mb-3">assurer le bon fonctionnement de la plateforme ;</li>
          <li className="mb-3">gérer les échanges et demandes entre utilisateurs ;</li>
          <li className="mb-3">sécuriser les comptes et prévenir les fraudes ;</li>
          <li className="mb-3">gérer les paiements et abonnements éventuels ;</li>
          <li className="mb-3">respecter les obligations légales et réglementaires.</li>
        </ul>
      </section>
      </Reveal>

      <Reveal delay={0.5}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">6. Base légale du traitement</h2>
        <ul>
          <li className="mb-3">l’exécution du contrat entre Récoltéo et l’utilisateur ;</li>
          <li className="mb-3">le respect des obligations légales ;</li>
          <li className="mb-3">l’intérêt légitime de Récoltéo à assurer la sécurité et le bon fonctionnement de la plateforme ;</li>
          <li className="mb-3">le consentement de l’utilisateur lorsque celui-ci est requis.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">7. Paiements et prestataires tiers</h2>
        <p className="mb-3">Les paiements réalisés sur la plateforme sont traités via Stripe. Récoltéo ne stocke pas les données bancaires complètes des utilisateurs. Les informations de paiement sont traitées directement par Stripe conformément à leur propre politique de confidentialité.</p>
        <p className="mb-3">Récoltéo peut également faire appel à des prestataires techniques pour : l’hébergement du site, la maintenance, la sécurisation des services et l’envoi d’emails transactionnels. Ces prestataires n’accèdent aux données que dans la mesure nécessaire à leurs missions.</p>
      </section>
      </Reveal>

      <Reveal delay={0.75}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">8. Cookies</h2>
        <p className="mb-3">Le site utilise uniquement des cookies techniques indispensables au fonctionnement de la plateforme. Ces cookies permettent notamment : la connexion sécurisée au compte utilisateur, le maintien de session, le bon affichage du site et la sécurité du service. Aucun cookie publicitaire ou de suivi marketing n’est utilisé.</p>
      </section>
      </Reveal>

      <Reveal delay={1.0}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">9. Durée de conservation des données</h2>
        <ul>
          <li className="mb-3">Les données personnelles sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées. À titre indicatif :</li>
          <li className="mb-3">les données de compte sont conservées pendant la durée d’activité du compte ;</li>
          <li className="mb-3">certaines données peuvent être conservées plus longtemps afin de respecter des obligations légales ou fiscales ;</li>
          <li className="mb-3">les données peuvent être supprimées à la demande de l’utilisateur, sous réserve des obligations légales applicables.</li>
        </ul>
      </section>
      </Reveal>

      <Reveal delay={0.5}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">10. Sécurité des données</h2>
        <p className="mb-3">Récoltéo met en œuvre des mesures techniques et organisationnelles appropriées afin de protéger les données personnelles contre l’accès non autorisé, la divulgation, la modification, la perte ou la destruction.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">11. Droits des utilisateurs</h2>
        <p className="mb-3">Conformément au RGPD, les utilisateurs disposent des droits suivants :</p>
        <ul>
          <li className="mb-3">droit d’accès ;</li>
          <li className="mb-3">droit de rectification ;</li>
          <li className="mb-3">droit à l’effacement ;</li>
          <li className="mb-3">droit à la limitation du traitement ;</li>
          <li className="mb-3">droit d’opposition ;</li>
          <li className="mb-3">droit à la portabilité des données ;</li>
          <li className="mb-3">droit de retirer leur consentement à tout moment.</li>
        </ul>
        <p className="mb-3">Les utilisateurs peuvent exercer leurs droits en contactant : Email : digitalbylucie@gmail.com. Les utilisateurs disposent également du droit d’introduire une réclamation auprès d’une autorité de contrôle compétente, notamment auprès de la Commission nationale de l'informatique et des libertés.</p>
      </section>
      </Reveal>

      <Reveal delay={0.75}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">12. Modification de la politique</h2>
        <p className="mb-3">Récoltéo se réserve le droit de modifier la présente politique de confidentialité à tout moment afin de refléter les évolutions légales, réglementaires ou techniques. Les utilisateurs seront informés des modifications importantes via la plateforme ou par email.</p>
      </section>
      </Reveal>

       <Reveal delay={1.0}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">13. Contact</h2>
        <ul>
          <li className="mb-3">Pour toute question relative à la présente politique de confidentialité ou au traitement des données personnelles :</li>
          <li className="mb-3">Récoltéo</li>
          <li className="mb-3">Responsable : Lucie Curtatone</li>
          <li className="mb-3">Email : digitalbylucie@gmail.com</li>
          <li className="mb-3">Adresse : 6 rue du Bac, 38190, Villard Bonnot</li>
        </ul>
      </section>
      </Reveal>
    </main>
  );
}
