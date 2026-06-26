import Link from "next/link";
import Reveal from "@/src/components/animations/Reveal";

export default function PolitiqueDeConfidentialite() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-base leading-8 text-sapin font-sans">
      <Reveal delay={0.5}>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-sapin mb-4">
          Politique de confidentialité
        </h1>
        <p className="text-sapin/60 text-base mb-10">Dernière mise à jour : juin 2026</p>
        <p className="mb-8">
          La présente politique a pour objet d'informer les utilisateurs de la plateforme Récoltéo
          sur la manière dont leurs données personnelles sont collectées, utilisées et protégées,
          conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).
        </p>
      </Reveal>

      <Reveal delay={0.65}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">1. Responsable du traitement</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 space-y-1 text-base text-sapin/80">
            <p><strong>Société :</strong> Récoltéo</p>
            <p><strong>Responsable :</strong> Lucie Curtatone</p>
            <p><strong>Adresse :</strong> 6 rue du Bac, 38190 Villard Bonnot</p>
            <p>
              <strong>Email :</strong>{" "}
              <a href="mailto:contact@recolteo.fr" className="underline hover:text-sapin transition-colors">
                contact@recolteo.fr
              </a>
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.8}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">2. Hébergement</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-base text-sapin/80">
            <p className="mb-2">
              La plateforme est hébergée par <strong>Vercel Inc.</strong> (440 N Barranca Ave #4133, Covina, CA 91723, États-Unis).
            </p>
            <p>
              Les données peuvent être transférées en dehors de l'UE. Vercel met en place des garanties conformes au
              RGPD (clauses contractuelles types approuvées par la Commission européenne).
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.1}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">3. Données collectées</h2>
          <div className="space-y-3">
            {[
              {
                title: "Données d'identification",
                items: ["Nom complet", "Adresse email", "Numéro de téléphone", "Adresse postale"],
              },
              {
                title: "Données professionnelles",
                items: ["Nom de l'entreprise / de l'association", "Numéro SIRET ou RNA", "Forme juridique, type d'activité"],
              },
              {
                title: "Données de compte",
                items: ["Identifiants de connexion (gérés par Supabase Auth)", "Historique des interactions (lots, réservations)"],
              },
              {
                title: "Données de paiement",
                items: [
                  "Identifiant client Stripe",
                  "Type de moyen de paiement (carte bancaire ou prélèvement SEPA) et 4 derniers chiffres",
                  "Identifiant et statut de l'abonnement Stripe (associations uniquement)",
                  "Date de fin de période d'abonnement en cours",
                  "Aucune coordonnée bancaire complète n'est stockée par Récoltéo — données traitées exclusivement par Stripe (certifié PCI-DSS niveau 1)",
                ],
              },
              {
                title: "Documents justificatifs",
                items: ["RIB, Kbis, pièce d'identité (transmis volontairement, chiffrés AES-256-GCM côté serveur)"],
              },
              {
                title: "Données techniques",
                items: ["Adresse IP", "Cookies de session et préférences (voir politique cookies)"],
              },
              {
                title: "Données de géolocalisation (associations, avec consentement)",
                items: ["Coordonnées géographiques (lat/lon) dérivées de l'adresse postale via l'API Base Adresse Nationale — aucune donnée GPS collectée"],
              },
            ].map(({ title, items }) => (
              <div key={title} className="border border-sapin/10 rounded-2xl p-5 bg-beige/40">
                <p className="font-semibold text-sapin mb-2">{title}</p>
                <ul className="list-disc list-inside text-base text-sapin/70 space-y-1">
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.25}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">4. Finalités du traitement</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40">
            <ul className="list-disc list-inside text-base text-sapin/80 space-y-1.5">
              <li>Création et gestion des comptes utilisateurs</li>
              <li>Mise en relation commerçants / associations</li>
              <li>Gestion des lots, réservations et reçus CERFA</li>
              <li>Envoi d'emails transactionnels (confirmation, notifications)</li>
              <li>Sécurisation des comptes et prévention des fraudes</li>
              <li>Gestion des abonnements annuels et facturation automatique (associations)</li>
              <li>Prélèvement automatique des commissions sur collectes validées (commerçants)</li>
              <li>Envoi de notifications de renouvellement et de statut d'abonnement</li>
              <li>Filtre de proximité géographique (associations consentantes)</li>
              <li>Respect des obligations légales et réglementaires</li>
            </ul>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.4}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">5. Base légale du traitement</h2>
          <div className="space-y-3">
            {[
              { base: "Art. 6.1.b — Exécution du contrat", detail: "Création de compte, gestion des lots et réservations, emails transactionnels, gestion des abonnements et facturation, prélèvement des commissions sur collectes." },
              { base: "Art. 6.1.c — Obligation légale", detail: "Conservation des données comptables et fiscales, reçus CERFA." },
              { base: "Art. 6.1.f — Intérêt légitime", detail: "Sécurité de la plateforme, prévention de la fraude." },
              { base: "Art. 6.1.a — Consentement", detail: "Cookies optionnels, géolocalisation de l'adresse, notifications utilisateurs en cas de violation de données." },
            ].map(({ base, detail }) => (
              <div key={base} className="border border-sapin/10 rounded-2xl p-4 bg-beige/40">
                <p className="font-semibold text-sapin text-base">{base}</p>
                <p className="text-base text-sapin/70 mt-0.5">{detail}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.5}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">6. Sous-traitants et prestataires</h2>
          <div className="space-y-3">
            {[
              { name: "Supabase", role: "Base de données et authentification", dpa: true },
              { name: "Vercel", role: "Hébergement de la plateforme", dpa: true },
              { name: "Resend", role: "Envoi d'emails transactionnels", dpa: true },
              { name: "Stripe", role: "Traitement des paiements, abonnements associations et commissions commerçants — certifié PCI-DSS niveau 1 ; aucune coordonnée bancaire complète stockée par Récoltéo", dpa: true },
              { name: "API Base Adresse Nationale (Etalab)", role: "Géocodage des adresses postales (avec consentement) — service public français, ne conserve pas les données", dpa: false },
            ].map(({ name, role, dpa }) => (
              <div key={name} className="border border-sapin/10 rounded-2xl p-4 bg-beige/40 flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-sapin text-base">{name}</p>
                  <p className="text-base text-sapin/70 mt-0.5">{role}</p>
                </div>
                {dpa && (
                  <span className="text-xs bg-lime text-sapin font-semibold px-2 py-0.5 rounded-full shrink-0">DPA signé</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.6}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">7. Cookies et stockage local</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-base text-sapin/80">
            <p className="mb-2">
              Le site utilise des cookies nécessaires (session Supabase, préférences de consentement) ainsi que des
              cookies optionnels soumis à votre consentement : analytiques, fonctionnels, géolocalisation d'adresse.
              Un stockage local (<span className="font-mono">localStorage</span>) est utilisé pour mémoriser votre panier.
            </p>
            <p>
              Aucun cookie publicitaire n'est utilisé.{" "}
              <Link href="/cookies" className="underline hover:text-sapin/70 transition-colors font-semibold">
                Consulter la politique de gestion des cookies →
              </Link>
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.7}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">8. Durée de conservation</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40">
            <table className="w-full text-base text-sapin/70 border-collapse">
              <thead>
                <tr className="border-b border-sapin/10">
                  <th className="text-left py-1.5 pr-4 font-semibold">Catégorie</th>
                  <th className="text-left py-1.5 font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sapin/5">
                <tr>
                  <td className="py-2 pr-4">Données de compte (profil, coordonnées)</td>
                  <td className="py-2">Durée d'activité + 3 ans après clôture</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Documents justificatifs (RIB, Kbis, pièce d'identité)</td>
                  <td className="py-2">Durée de la relation + 5 ans (obligation comptable)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Données de réservation et lots</td>
                  <td className="py-2">5 ans (obligations légales et fiscales)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Données de paiement Stripe (identifiant client, moyen de paiement, abonnement)</td>
                  <td className="py-2">Durée de la relation + 10 ans (obligations comptables et fiscales)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Données de contact (formulaire)</td>
                  <td className="py-2">3 ans à compter de la dernière interaction</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Cookies de consentement</td>
                  <td className="py-2">12 mois maximum (CNIL)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Logs de connexion</td>
                  <td className="py-2">12 mois</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-base text-sapin/50 mt-3">
            Ces durées peuvent être prolongées pour satisfaire des obligations légales ou en cas de contentieux.
            Vos données sont supprimées à votre demande, sous réserve des obligations légales applicables.
          </p>
        </section>
      </Reveal>

      <Reveal delay={1.8}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">9. Sécurité des données</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-base text-sapin/80 space-y-2">
            <p>Récoltéo met en œuvre les mesures suivantes pour protéger vos données :</p>
            <ul className="list-disc list-inside space-y-1 text-sapin/70">
              <li>Chiffrement de bout en bout des communications (HTTPS/TLS)</li>
              <li>Documents justificatifs chiffrés avec <strong>AES-256-GCM</strong> côté serveur avant stockage</li>
              <li>Authentification sécurisée via Supabase Auth (hachage des mots de passe)</li>
              <li>En-têtes de sécurité HTTP (CSP, X-Frame-Options, HSTS en production)</li>
              <li>Accès aux données restreint par rôle (Row Level Security Supabase)</li>
              <li>Procédure de notification des violations de données (Art. 33 &amp; 34 RGPD)</li>
            </ul>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.95}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">10. Traitement des données de paiement</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sapin/80 space-y-3">
            <div>
              <p className="font-semibold text-base text-sapin mb-2">Modèle économique de la plateforme</p>
              <ul className="list-disc list-inside text-base text-sapin/70 space-y-1">
                <li><strong>Associations :</strong> abonnement annuel avec période d'essai gratuite de 6 mois, géré via Stripe.</li>
                <li><strong>Commerçants :</strong> commission de 10 % prélevée automatiquement par Stripe à chaque validation de collecte.</li>
              </ul>
            </div>
            <p className="text-sapin/70">
              Le traitement des paiements est confié exclusivement à <strong>Stripe Inc.</strong>,
              prestataire certifié <strong>PCI-DSS niveau 1</strong>. Les coordonnées bancaires complètes
              (numéro de carte, IBAN complet) ne transitent jamais par les serveurs de Récoltéo et ne
              sont pas stockées dans notre base de données.
            </p>
            <p className="text-sapin/70">
              Récoltéo conserve uniquement : l'identifiant client Stripe, le type et les 4 derniers chiffres
              du moyen de paiement, l'identifiant et le statut de l'abonnement, ainsi que la date de fin de
              période. Ces données sont traitées sur la base légale de l'exécution du contrat (Art. 6.1.b RGPD).
            </p>
            <p className="text-sapin/70">
              En cas de litige ou d'anomalie de facturation, contactez-nous à{" "}
              <a href="mailto:contact@recolteo.fr" className="underline hover:text-sapin/70 transition-colors">
                contact@recolteo.fr
              </a>.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.9}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">11. Vos droits</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 mb-4">
            <p className="text-base text-sapin/80 mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside text-base text-sapin/70 space-y-1">
              <li>Droit d'accès à vos données (Art. 15)</li>
              <li>Droit de rectification (Art. 16)</li>
              <li>Droit à l'effacement / « droit à l'oubli » (Art. 17)</li>
              <li>Droit à la limitation du traitement (Art. 18)</li>
              <li>Droit à la portabilité (Art. 20) — exportez vos données via votre espace profil</li>
              <li>Droit d'opposition (Art. 21)</li>
              <li>Droit de retirer votre consentement à tout moment</li>
            </ul>
          </div>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-base text-sapin/80">
            <p className="mb-2">
              Pour exercer vos droits, contactez-nous à :{" "}
              <a href="mailto:contact@recolteo.fr" className="underline hover:text-sapin/70 transition-colors font-semibold">
                contact@recolteo.fr
              </a>
            </p>
            <p className="text-sapin/60 text-base">
              Vous pouvez également introduire une réclamation auprès de la{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-sapin/70 transition-colors">
                CNIL (www.cnil.fr)
              </a>.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={2.0}>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-sapin mb-4">12. Modification de la politique</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-base text-sapin/80">
            <p>
              Récoltéo se réserve le droit de modifier la présente politique à tout moment. Les utilisateurs
              seront informés des modifications importantes via la plateforme ou par email. La version en
              vigueur est celle publiée sur cette page.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={2.2}>
        <p className="text-base text-sapin/40 border-t border-sapin/10 pt-6">
          Politique de confidentialité Récoltéo — juin 2026 — Conforme au RGPD (Règlement UE 2016/679).
        </p>
      </Reveal>
    </main>
  );
}
