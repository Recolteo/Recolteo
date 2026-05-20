import Reveal from "@/src/components/animations/Reveal";

export default function MentionsLegales() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-base leading-8 text-sapin">
      <Reveal delay={0.5}>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-sapin mb-10">
        Mentions légales
      </h1>
      </Reveal>

      <Reveal delay={0.7}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">1. Éditeur</h2>
        <ul className="space-y-1">
          <li className="mb-3">Société : Récoltéo</li>
          <li className="mb-3">Capital : –</li>
          <li className="mb-3">Siège social : 6 rue du Bac, 38190 Villard Bonnot</li>
          <li className="mb-3">SIRET : 882 691 405 00063</li>
          <li className="mb-3">Numéro de TVA : FR 280 56 50 29 58</li>
          <li className="mb-3">Téléphone : 06 50 00 53 42</li>
          <li
            className="mb-3">Mail : {" "}
            <a href="mailto:digitalbylucie@gmail.com" className="underline hover:text-sapin">
              digitalbylucie@gmail.com
            </a>
          </li>
          <li className="mb-3">Directeur de publication : Lucie Curtatone</li>
          <li className="mb-3">Co-gérants : Isabelle Colombera, Florian Cipriani, Kérian Boukaala</li>
        </ul>
      </section>
      </Reveal>

      <Reveal delay={1.0}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">2. Hébergement de la plateforme</h2>
        <p>Vercel Inc. (États-Unis)</p>
      </section>
      </Reveal>

      <Reveal delay={0.5}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">3. Propriété intellectuelle</h2>
        <p className="mb-3">
          L'ensemble du contenu de cette plateforme — textes, photographies, dessins, images, séquences
          sonores — est la propriété de Récoltéo ou de tiers ayant autorisé Récoltéo à les utiliser et
          relève de la législation française et internationale sur le droit d'auteur et la propriété
          intellectuelle.
        </p>
        <p className="mb-3">
          Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables
          et les représentations iconographiques et photographiques.
        </p>
        <p className="mb-3">
          Le nom Récoltéo et le logo associé, ainsi que les noms des produits éventuellement présentés
          sur la présente plateforme, sont des marques appartenant à Récoltéo ou à ses filiales.
        </p>
        <p>
          La reproduction, la représentation ou la diffusion de la plateforme et/ou de tout élément
          appartenant à Récoltéo ou à ses filiales sans autorisation écrite et préalable constitue une
          contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété
          intellectuelle.
        </p>
      </section>
      </Reveal>

      <Reveal delay={0.75}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">4. Crédit photo/vidéo</h2>
        <p className="mb-3">
          Les images et vidéos utilisées sur ce site proviennent de banques d'images libres de droits
          ou ont été créées spécifiquement pour cette plateforme.
        </p>
        <p className="mb-3">
          Certaines ressources peuvent provenir de plateformes telles que Unsplash, Pexels ou autres
          banques d'images libres, utilisées conformément à leurs conditions de licence.
        </p>
        <p className="mb-3">Les auteurs des images restent propriétaires de leurs œuvres respectives.</p>
      </section>
      </Reveal>

      <Reveal delay={1.0}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">5. Responsabilité de l'éditeur</h2>
        <p className="mb-3">
          L'éditeur de la plateforme Récoltéo met tout en œuvre pour assurer l'exactitude et la mise à
          jour des informations fournies. Il ne peut garantir que ces informations soient complètes,
          précises, exactes ou dépourvues d'erreurs.
        </p>
        <p className="mb-3">Récoltéo ne peut garantir :</p>
        <ul className="list-disc list-inside space-y-1 mb-3">
          <li className="mb-3">des interruptions temporaires pour maintenance ou mise à jour ;</li>
          <li className="mb-3">des dysfonctionnements techniques, bugs ou incompatibilités ;</li>
          <li className="mb-3">des dommages directs ou indirects résultant de l'utilisation du site ;</li>
          <li className="mb-3">des contenus de sites tiers accessibles via des liens hypertextes.</li>
        </ul>
        <p>
          L'utilisateur reconnaît utiliser le site sous sa responsabilité exclusive et s'engage à
          vérifier les informations obtenues avant toute utilisation.
        </p>
      </section>
      </Reveal>

      <Reveal delay={0.5}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">
          6. Modification du site et mise à jour des conditions d'utilisation
        </h2>
        <p>
          Récoltéo peut à tout moment et sans préavis modifier tout ou partie du contenu de la
          plateforme. Les utilisateurs sont invités à consulter régulièrement le site pour prendre
          connaissance des conditions applicables.
        </p>
      </section>
      </Reveal>

      <Reveal delay={0.75}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">7. Droit applicable</h2>
        <p className="mb-3">
          Les présentes mentions légales sont régies par le droit français et le Règlement Général sur
          la Protection des Données (RGPD). En cas de litige, les parties s'efforceront de rechercher
          une solution amiable avant toute action judiciaire.
        </p>
        <p className="mb-3">
          Les présentes dispositions s'appliquent dans le respect des droits accordés par :
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li className="mb-3">le Code civil ;</li>
          <li className="mb-3">le Code de la consommation ;</li>
          <li className="mb-3">le Code de la propriété intellectuelle ;</li>
          <li className="mb-3">le Règlement Général sur la Protection des Données (RGPD) ;</li>
          <li className="mb-3">la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés.</li>
        </ul>
      </section>
      </Reveal>

      <Reveal delay={1.0}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">8. Activités interdites sur le site</h2>
        <p className="mb-3">En tant qu'utilisateur, vous acceptez de ne pas :</p>
        <ul className="list-disc list-inside space-y-1">
          <li className="mb-3">Extraire systématiquement des données sans autorisation écrite ;</li>
          <li className="mb-3">Faire une utilisation non autorisée de la plateforme ;</li>
          <li className="mb-3">Utiliser la plateforme pour faire de la publicité ou proposer des biens/services ;</li>
          <li className="mb-3">Contourner les fonctions de sécurité du site ;</li>
          <li className="mb-3">Tromper, frauder ou induire en erreur Récoltéo et les autres utilisateurs ;</li>
          <li className="mb-3">Tenter d'usurper l'identité d'un autre utilisateur ;</li>
          <li className="mb-3">Décompiler ou faire de l'ingénierie inverse sur les logiciels de la plateforme ;</li>
          <li className="mb-3">Télécharger ou transmettre des virus ou autres éléments malveillants ;</li>
          <li className="mb-3">Utiliser la plateforme d'une manière incompatible avec les lois applicables.</li>
        </ul>
      </section>
      </Reveal>

      <Reveal delay={0.5}>
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-sapin mb-4">9. Création d'un compte utilisateur</h2>
        <p className="mb-3">
          Vous pouvez créer un compte utilisateur sur notre plateforme. Vous vous engagez à communiquer
          des informations exactes lors de la création de ce dernier. La création d'un compte sous
          l'identité d'un tiers est strictement interdite.
        </p>
        <p className="mb-3">
          Nous vous recommandons de choisir un mot de passe suffisamment robuste et de le changer sans
          délai en cas de suspicion d'utilisation frauduleuse. En cas d'utilisation frauduleuse de votre
          compte, veuillez nous contacter immédiatement à{" "}
          <a href="mailto:digitalbylucie@gmail.com" className="underline hover:text-sapin">
            digitalbylucie@gmail.com
          </a>.
        </p>
        <p className="mb-3">
          Il est de votre seule responsabilité de garder confidentiels vos identifiants et mots de passe.
          Toute utilisation de votre compte au moyen de vos identifiants est présumée avoir été effectuée
          par vous-même.
        </p>
      </section>
      </Reveal>
    </div>
  );
}