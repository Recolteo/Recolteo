import Link from "next/link";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
};

export default function CguCard({
  checked,
  onChange,
  id = "accept_cgu",
}: Props) {
  return (
    <div className="flex items-start gap-3 p-4 bg-sapin/5 border border-sapin/10 rounded-xl">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-sapin shrink-0 cursor-pointer"
      />
      <label
        htmlFor={id}
        className="text-sm text-sapin/80 leading-relaxed cursor-pointer"
      >
        J'ai lu et j'accepte les{" "}
        <Link
          href="/mentions-legales"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-sapin transition-colors"
        >
          Conditions Générales d'Utilisation
        </Link>{" "}
        et la{" "}
        <Link
          href="/politique-de-confidentialite"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-sapin transition-colors"
        >
          politique de confidentialité
        </Link>{" "}
        de Récoltéo. <span className="text-peach font-semibold">*</span>
      </label>
    </div>
  );
}
