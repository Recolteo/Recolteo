import Reveal from "@/src/components/animations/Reveal";

export default function MentionsLegales() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-base leading-8 text-sapin">
      <Reveal delay={0.5}>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-sapin mb-4">
          Mentions légales
        </h1>
        <p className="text-sapin/60 text-sm mb-10">Dernière mise à jour : mai 2026</p>
      </Reveal>

      <Reveal delay={0.65}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">1. Éditeur</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80 space-y-1">
            <p><strong>Société :</strong> Récoltéo</p>
            <p><strong>Capital :</strong> –</p>
            <p><strong>Siège social :</strong> 6 rue du Bac, 38190 Villard Bonnot</p>
            <p><strong>SIRET :</strong> 882 691 405 00063</p>
            <p><strong>Numéro de TVA :</strong> FR 280 56 50 29 58</p>
            <p><strong>Téléphone :</strong> 06 50 00 53 42</p>
            <p>
              <strong>Email :</strong>{" "}
              <a href="mailto:digitalbylucie@gmail.com" className="underline hover:text-sapin/70 transition-colors">
                digitalbylucie@gmail.com
              </a>
            </p>
            <p><strong>Directeur de publication :</strong> Lucie Curtatone</p>
            <p><strong>Co-gérants :</strong> Isabelle Colombera, Florian Cipriani, Kérian Boukaala</p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.8}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">2. Hébergement</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80">
            <p><strong>Vercel Inc.</strong> — 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.95}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">3. Propriété intellectuelle</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80 space-y-2">
            <p>
              L'ensemble du contenu de cette plateforme — textes, images, séquences sonores — est la propriété
              de Récoltéo ou de tiers ayant autorisé son utilisation et relève de la législation française et
              internationale sur le droit d'auteur et la propriété intellectuelle.
            </p>
            <p>
              Tous les droits de reproduction sont réservés. La reproduction, représentation ou diffusion sans
              autorisation écrite préalable constitue une contrefaçon sanctionnée par les articles L.335-2 et
              suivants du Code de la propriété intellectuelle.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.1}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">4. Crédit photo / vidéo</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80">
            <p>
              Les images utilisées proviennent de banques d'images libres de droits (Unsplash, Pexels) ou ont
              été créées spécifiquement pour cette plateforme. Les auteurs des images restent propriétaires de
              leurs œuvres respectives.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.25}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">5. Responsabilité de l'éditeur</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80 space-y-2">
            <p>
              L'éditeur met tout en œuvre pour assurer l'exactitude des informations publiées mais ne peut
              garantir leur exhaustivité. Récoltéo ne saurait être tenu responsable :
            </p>
            <ul className="list-disc list-inside space-y-1 text-sapin/70">
              <li>d'interruptions temporaires pour maintenance ou mise à jour ;</li>
              <li>de dysfonctionnements techniques ou incompatibilités ;</li>
              <li>de dommages directs ou indirects résultant de l'utilisation du site ;</li>
              <li>des contenus de sites tiers accessibles via des liens hypertextes.</li>
            </ul>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.4}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">6. Modification du site</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80">
            <p>
              Récoltéo peut à tout moment et sans préavis modifier tout ou partie du contenu de la plateforme.
              Les utilisateurs sont invités à consulter régulièrement le site pour prendre connaissance des
              conditions applicables.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.55}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">7. Droit applicable</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80 space-y-2">
            <p>
              Les présentes mentions légales sont régies par le droit français et le RGPD. En cas de litige,
              les parties s'efforceront de rechercher une solution amiable avant toute action judiciaire.
            </p>
            <p>Textes applicables :</p>
            <ul className="list-disc list-inside space-y-1 text-sapin/70">
              <li>Code civil ;</li>
              <li>Code de la consommation ;</li>
              <li>Code de la propriété intellectuelle ;</li>
              <li>Règlement Général sur la Protection des Données (RGPD — UE 2016/679) ;</li>
              <li>Loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés.</li>
            </ul>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.7}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">8. Activités interdites</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80">
            <p className="mb-2">En tant qu'utilisateur, vous acceptez de ne pas :</p>
            <ul className="list-disc list-inside space-y-1 text-sapin/70">
              <li>Extraire systématiquement des données sans autorisation écrite ;</li>
              <li>Utiliser la plateforme à des fins publicitaires ou commerciales non autorisées ;</li>
              <li>Contourner les fonctions de sécurité du site ;</li>
              <li>Tromper, frauder ou usurper l'identité d'un autre utilisateur ;</li>
              <li>Décompiler ou faire de l'ingénierie inverse sur les logiciels ;</li>
              <li>Transmettre des virus ou éléments malveillants ;</li>
              <li>Utiliser la plateforme d'une manière incompatible avec les lois applicables.</li>
            </ul>
          </div>
        </section>
      </Reveal>

      <Reveal delay={1.85}>
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">9. Création d'un compte utilisateur</h2>
          <div className="border border-sapin/10 rounded-2xl p-5 bg-beige/40 text-sm text-sapin/80 space-y-2">
            <p>
              Vous vous engagez à communiquer des informations exactes lors de la création de votre compte.
              La création d'un compte sous l'identité d'un tiers est strictement interdite.
            </p>
            <p>
              Nous vous recommandons de choisir un mot de passe robuste et de le modifier sans délai en cas
              de suspicion d'utilisation frauduleuse. En cas d'utilisation frauduleuse, contactez-nous
              immédiatement à{" "}
              <a href="mailto:digitalbylucie@gmail.com" className="underline hover:text-sapin/70 transition-colors">
                digitalbylucie@gmail.com
              </a>.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={2.0}>
        <p className="text-xs text-sapin/40 border-t border-sapin/10 pt-6">
          Mentions légales Récoltéo — mai 2026
        </p>
      </Reveal>
    </main>
  );
}
