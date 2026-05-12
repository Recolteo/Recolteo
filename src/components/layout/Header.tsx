"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "@deemlol/next-icons";
import Btn from "../ui/Button";

const navLinks = [
  { label: "Marché", href: "/marche" },
  { label: "Producteurs", href: "/producteurs" },
  { label: "Saison", href: "/saison" },
  { label: "Journal", href: "/journal" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

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
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-1.5 font-bold text-sapin hover:text-sapin hover:bg-sapin/10 rounded-xl transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/panier"
              aria-label="Panier"
              className="relative p-2 rounded-xl text-sapin hover:text-sapin hover:bg-sapin/10 transition-all duration-150"
            >
              <ShoppingBag size={20} />
            </Link>

            <div className="hidden sm:block">
              <Btn label="Se connecter" href="/login" variant="sapin" size="sm" showArrow={false} />
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="md:hidden p-2 rounded-xl text-sapin hover:text-sapin hover:bg-sapin/10 transition-all duration-150"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t-2 border-sapin/10 px-4 pb-4 pt-3 flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-3.5 py-2.5 text-sm font-bold text-sapin hover:text-sapin hover:bg-sapin/10 rounded-xl transition-all duration-150"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 pt-3 border-t border-sapin/10">
              <Btn label="Se connecter" href="/login" variant="sapin" size="sm" showArrow={false} />
            </div>
          </div>
        )}

      </header>
    </div>
  );
}

