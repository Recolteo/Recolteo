"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "@deemlol/next-icons";
import Btn from "../ui/primitives/Button";
import { useCart } from "@/src/lib/cart-context";

type UserInfo = {
  nom: string;
  role: "commercant" | "association" | "admin";
};

interface HeaderProps {
  user?: UserInfo;
}

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Découvrir Récoltéo", href: "/decouvrir-recolteo" },
  { label: "Lots", href: "/lots" },
  { label: "Contact", href: "/contact" },
];

function CartButton() {
  const { items } = useCart();
  return (
    <button className="relative p-2 rounded-xl text-sapin hover:bg-sapin/10 transition-all">
      <ShoppingBag size={20} />
      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-peach text-cream text-[9px] font-bold flex items-center justify-center leading-none">
        {items.length}
      </span>
    </button>
  );
}

export default function Header({ user }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const adminLink = { label: "Admin", href: "/admin" };
  const links = user?.role === "admin" ? [...navLinks, adminLink] : navLinks;

  return (
    <div className="fixed top-3 left-0 right-0 z-50 px-4">
      <header className="max-w-7xl mx-auto bg-cream/90 backdrop-blur-sm border-2 border-sapin/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-bold text-2xl text-sapin tracking-tight hover:opacity-80 transition-opacity shrink-0"
          >
            Récoltéo
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-1.5 font-bold text-sapin hover:bg-sapin/10 rounded-xl transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user?.role === "association" && (
              <Link href="/panier">
                <CartButton />
              </Link>
            )}

            {user ? (
              <Link
                href="/profil"
                className="hidden md:flex w-9 h-9 rounded-xl bg-sapin text-cream font-black text-sm items-center justify-center hover:bg-sapin/80 transition-all shadow-[3px_3px_0_0_#04251c]"
                aria-label="Mon compte"
              >
                {user.nom[0].toUpperCase()}
              </Link>
            ) : (
              <div className="hidden md:block">
                <Btn
                  label="Se connecter"
                  href="/login"
                  variant="sapin"
                  size="sm"
                  showArrow={false}
                />
              </div>
            )}

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="md:hidden p-2 rounded-xl text-sapin hover:bg-sapin/10 transition-all duration-150"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t-2 border-sapin/10 px-4 pb-4 pt-3 flex flex-col gap-1">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm font-bold text-sapin hover:bg-sapin/10 rounded-xl transition-all duration-150"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 pt-3 border-t border-sapin/10">
              {user ? (
                <Link
                  href="/profil"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sapin font-bold hover:bg-sapin/10 transition-all duration-150"
                >
                  <span className="w-7 h-7 rounded-lg bg-sapin text-cream font-black text-xs flex items-center justify-center shrink-0">
                    {user.nom[0].toUpperCase()}
                  </span>
                  <span className="text-sm truncate">{user.nom}</span>
                </Link>
              ) : (
                <Btn
                  label="Se connecter"
                  href="/login"
                  variant="sapin"
                  size="sm"
                  showArrow={false}
                />
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
