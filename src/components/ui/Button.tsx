import Link from "next/link";
import { ArrowRight } from "@deemlol/next-icons";

type Variant =
  | "sapin"
  | "lime"
  | "peach"
  | "sapin-outline"
  | "lime-outline"
  | "peach-outline";

type Size = "sm" | "md";

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  variant?: Variant;
  showArrow?: boolean;
  size?: Size;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  label,
  href,
  onClick,
  type,
  variant,
  showArrow = true,
  size = "md",
  disabled,
  className = "",
}: ButtonProps) {
  const variantStyles =
    variant === "sapin"
      ? "bg-sapin text-cream hover:bg-sapin/90 border border-sapin shadow-[4px_4px_0_0_#04251c] rounded-2xl"
      : variant === "lime"
        ? "bg-lime text-sapin hover:bg-lime/80 border border-lime shadow-[4px_4px_0_0_#04251c] rounded-2xl"
        : variant === "peach"
          ? "bg-peach text-cream hover:bg-peach/90 border border-peach shadow-[4px_4px_0_0_#d54a00] rounded-2xl"
          : variant === "sapin-outline"
            ? "border border-sapin text-sapin hover:bg-sapin hover:text-cream shadow-[4px_4px_0_0_#06573F]"
            : variant === "lime-outline"
              ? "border border-lime text-sapin hover:bg-lime shadow-[4px_4px_0_0_#c9f242]"
              : "border border-peach text-peach hover:bg-peach hover:text-cream shadow-[4px_4px_0_0_#d54a00]";

  const sizeStyles =
    size === "sm"
      ? "px-4 py-2 text-sm rounded-lg gap-2"
      : "px-7 py-3.5 rounded-xl gap-3";

  const base = `group inline-flex items-center justify-center font-semibold transition-all active:scale-95 disabled:opacity-50 ${sizeStyles} ${variantStyles} ${className}`;

  const arrow = showArrow && (
    <ArrowRight
      size={size === "sm" ? 15 : 20}
      className="transition-transform duration-200 group-hover:translate-x-1"
    />
  );

  if (onClick || type)
    return (
      <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={base}>
        {label}
        {arrow}
      </button>
    );

  if (href?.startsWith("#"))
    return (
      <a href={href} className={base}>
        {label}
        {arrow}
      </a>
    );

  if (!href) return null;

  return (
    <Link href={href} className={base}>
      {label}
      {arrow}
    </Link>
  );
}
