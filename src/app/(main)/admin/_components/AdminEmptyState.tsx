import { LeafFull } from "@/src/components/illustrations/assetsIllustrations";

export default function AdminEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 px-8 border-2 border-dashed border-sapin/15 rounded-3xl bg-white/50 text-center">
      <div className="w-14 opacity-40">
        <LeafFull />
      </div>
      <div>
        <p className="text-sapin font-bold text-lg">Tout est à jour !</p>
        <p className="text-sapin/50 text-sm mt-1">
          Aucun profil en attente de validation.
        </p>
      </div>
    </div>
  );
}
