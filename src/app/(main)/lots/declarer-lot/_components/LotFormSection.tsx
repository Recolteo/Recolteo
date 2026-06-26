"use client";

import { useState } from "react";
import Reveal from "@/src/components/animations/Reveal";
import SlideIn from "@/src/components/animations/SlideIn";
import CtaBanner from "@/src/components/ui/sections/CtaBanner";
import { DeclarerLotDecorations } from "@/src/components/illustrations/assetsIllustrations";
import LotForm from "./LotForm";
import ExcelImportModal from "./ExcelImportModal";
import type { LotFormProps } from "./types";

type Props = {
  form: LotFormProps;
  sectionTitle: string;
  sectionTitleAccent: string;
  sectionDescription: string;
};

export default function LotFormSection({
  form,
  sectionTitle,
  sectionTitleAccent,
  sectionDescription,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative max-w-7xl mx-auto">
      <DeclarerLotDecorations />

      <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="flex flex-col gap-8">
          <Reveal delay={0}>
            <div>
              <h2 className="text-sapin font-black mb-4">
                {sectionTitle}{" "}
                <span className="relative italic whitespace-nowrap">
                  <span
                    className="absolute inset-0 bg-lime rounded-lg -rotate-1 scale-x-110"
                    aria-hidden="true"
                  />
                  <span className="relative">{sectionTitleAccent}</span>
                </span>
              </h2>
              <p className="text-sapin leading-relaxed max-w-md">
                {sectionDescription}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <CtaBanner
              heading="Vous avez plusieurs lots ?"
              subheading="Importez-les en masse depuis un fichier Excel pour gagner du temps."
              buttonLabel="Importer un Excel"
              onButtonClick={() => setModalOpen(true)}
            />
          </Reveal>
        </div>

        <SlideIn direction="right" delay={0.15}>
          <div className="bg-white border-2 border-sapin/10 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0_0_color-mix(in_srgb,var(--color-sapin)_8%,transparent)]">
            <LotForm {...form} />
          </div>
        </SlideIn>
      </div>

      {modalOpen && (
        <ExcelImportModal
          commercantId={form.mode === "commercant" ? form.id : undefined}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
