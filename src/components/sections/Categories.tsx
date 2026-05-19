"use client";

import Button from "../ui/Button";
import Reveal from "../animations/Reveal";
import DraggablePill from "../animations/DraggablePill";
import { categoryRows } from "../../lib/data/categories";
import { CategoriesDecorations } from "../illustrations/assetsIllustrations";

const pills = categoryRows.flat();

export default function Categories() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden">
      <CategoriesDecorations />
      <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-12 items-center">
        <div className="mb-16 lg:mb-0">
          <Reveal delay={0.12}>
            <h2 className="text-sapin font-black mb-4">
              Des catégories pour
              <br />
              <span className="italic text-peach">chaque besoin</span>
            </h2>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="text-sapin max-w-md mb-8">
              Invendus, matériel inutilisé, produits frais, chaque ressource
              trouve preneur à quelques rues de chez vous. Simple, rapide et
              immédiat.
            </p>
          </Reveal>
          <Reveal delay={0.36}>
            <Button
              label="Explorer les catégories"
              href="/dashboard"
              variant="sapin"
            />
          </Reveal>
        </div>

        <div className="flex flex-wrap gap-3 justify-center lg:hidden">
          {pills.map((cat, i) => (
            <DraggablePill key={cat.label} {...cat} index={i} />
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-col">
          {categoryRows.map((row, ri) => (
            <div
              key={ri}
              className="flex gap-6"
              style={{
                marginTop: ri === 0 ? 0 : 12,
                marginLeft: ri % 2 === 1 ? 52 : 0,
              }}
            >
              {row.map((cat, ci) => (
                <DraggablePill key={cat.label} {...cat} index={ri * 2 + ci} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
