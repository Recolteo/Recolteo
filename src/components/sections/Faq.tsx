"use client";

import { useState } from "react";
import Reveal from "../animations/Reveal";
import FaqItem from "../ui/FaqItem";
import { faqItems } from "@/src/lib/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto">
        <Reveal delay={0.15}>
          <div className="mb-12">
            <h2 className="text-sapin font-black mb-4">
              Questions <span className="italic text-peach">fréquentes</span>
            </h2>
            <Reveal delay={0.3}>
              <p className="text-sapin max-w-md leading-relaxed">
                Tout ce que vous devez savoir avant de vous lancer dans l'aventure avec nous.
              </p>
            </Reveal>
          </div>
        </Reveal>

        <div className="flex flex-col max-w-6xl mx-auto">
          {faqItems.map((item, i) => (
            <Reveal key={i} delay={0.1 * i}>
              <FaqItem
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
