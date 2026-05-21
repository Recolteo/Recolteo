import Reveal from "../animations/Reveal";

export default function CatalogueEmptyState() {
  return (
    <Reveal delay={0.2}>
      <div className="text-center py-16 bg-white border-2 border-sapin/10 rounded-2xl shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_6%,transparent)]">
        <p className="text-sapin/40 font-semibold mb-2">
          Aucun lot disponible pour le moment
        </p>
        <span className="block text-sm text-sapin/30">
          Revenez prochainement, de nouveaux lots sont ajoutés régulièrement.
        </span>
      </div>
    </Reveal>
  );
}
