import { connection } from "next/server";
import Link from "next/link";
import Button from "../ui/primitives/Button";
import Image from "next/image";
import footerIllustration from "@/src/asset/footer.svg";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Découvrir Récoltéo", href: "/decouvrir-recolteo" },
  { label: "Lots", href: "/lots" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  {
    label: "Politique de confidentialité",
    href: "/politique-de-confidentialite",
  },
  { label: "Gestion des cookies", href: "/cookies" },
  { label: "Mentions légales", href: "/mentions-legales" },
];

export default async function Footer() {
  await connection();
  return (
    <footer className=" text-cream mt-auto">
      <div
        className="relative w-full h-16 pointer-events-none select-none"
        inert
      >
        <Image
          src={footerIllustration}
          alt=""
          aria-hidden
          fill
          style={{ objectFit: "fill" }}
        />
      </div>
      <div className="bg-sapin">
        <div className="border-b border-cream/10">
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-lime mb-2">
                Rejoignez le réseau
              </p>
              <h2 className="font-black text-cream leading-tight">
                Prêt à faire{" "}
                <span className="text-lime italic">la différence ?</span>
              </h2>
            </div>
            <div className="self-start sm:self-auto">
              <Button label="Contactez-nous" href="/contact" variant="lime" />
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr] gap-8">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-black text-lg tracking-tight">Récoltéo</span>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              Connecte commerçants et associations locales pour une solidarité
              simple, rapide et accessible à tous.
            </p>
          </div>

          <div>
            <p className="font-semibold uppercase tracking-widest text-xs text-cream/40 mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-lime transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold uppercase tracking-widest text-xs text-cream/40 mb-4">
              Légal
            </p>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-lime transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 py-4">
          <div className="max-w-5xl mx-auto px-6 text-center text-cream/35 text-xs">
            © {new Date().getFullYear()} Récoltéo — Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
