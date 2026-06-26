import Btn from "@/src/components/ui/primitives/Button";

interface CartSummaryProps {
  itemCount: number;
  totalPrice: number;
  onReserver: () => void;
}

export default function CartSummary({
  itemCount,
  totalPrice,
  onReserver,
}: CartSummaryProps) {
  const cagnotte = totalPrice * 0.02;
  const formatEur = (v: number) =>
    v.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  return (
    <div className="bg-white border border-sapin/10 rounded-2xl shadow-[0_1px_8px_color-mix(in_srgb,var(--color-sapin)_6%,transparent)] sticky top-20">
      <div className="p-6">
        <p className="font-black text-sapin text-base mb-5">Récapitulatif</p>

        <div className="space-y-2.5 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-sapin/55">Lots sélectionnés</span>
            <span className="font-semibold text-sapin">{itemCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sapin/55">Cagnotte (2%)</span>
            <span className="font-semibold text-sapin">
              + {formatEur(cagnotte)}
            </span>
          </div>
          <div className="h-px bg-sapin/8 my-1" />
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-sapin text-sm">Total estimé</span>
            <span className="font-black text-peach text-lg">
              {formatEur(totalPrice)}
            </span>
          </div>
        </div>

        <Btn
          label="Réserver les lots"
          onClick={onReserver}
          variant="sapin"
          showArrow={false}
          className="w-full justify-center"
        />
        <p className="text-xs text-sapin/35 mt-3 text-center leading-relaxed">
          Choisissez votre créneau de récupération et obtenez votre code de
          retrait.
        </p>
      </div>
    </div>
  );
}
