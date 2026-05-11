import Link from "next/link";
import { ArrowRight } from "@deemlol/next-icons";

type Variant =
  | "sapin"
  | "lime"
  | "peach"
  | "sapin-outline"
  | "lime-outline"
  | "peach-outline";

interface ButtonProps {
  label: string;
  href: string;
  variant?: Variant;
}

export default function Button({
  label,
  href,
  variant
}: ButtonProps) {
  const variantStyles =
    variant === "sapin"
      ? "bg-sapin text-cream hover:bg-sapin/90"
      : variant === "lime"
        ? "bg-lime text-sapin hover:bg-lime/80"
        : variant === "peach"
          ? "bg-peach text-cream hover:bg-peach/90"
          : variant === "sapin-outline"
            ? "border border-sapin text-sapin hover:bg-sapin hover:text-cream"
            : variant === "lime-outline"
              ? "border border-lime text-sapin hover:bg-lime"
              : "border border-peach text-peach hover:bg-peach hover:text-cream";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold transition-colors ${variantStyles}`}
    >
      {label}
      <ArrowRight
        size={20}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
