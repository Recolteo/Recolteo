import Reveal from "../animations/Reveal";

export default function CatalogueHeader() {
  return (
    <Reveal delay={0.1}>
      <div className="mb-12">
        <h2 className="text-sapin font-black mb-4">
          Lots{" "}
          <span className="relative italic whitespace-nowrap">
            <span
              className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
              aria-hidden="true"
            />
            <span className="relative">disponibles</span>
          </span>
        </h2>
        <p className="text-sapin/70 max-w-2xl">
          Découvrez les invendus et ressources mis à disposition par nos commerçants
          partenaires. Chaque lot est une opportunité de lutter contre le gaspillage
          et de soutenir votre activité associative.
        </p>
      </div>
    </Reveal>
  );
}
