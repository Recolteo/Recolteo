import Reveal from "../animations/Reveal";
import ContactForm from "./ContactForm";
import ContactDecorations from "../illustrations/ContactDecorations";
import Image from "next/image";
import Ecureuil from "@/src/asset/ecureuil.webp";

interface ContactSectionProps {
  title: string;
  labelTitle: string;
  subtitle: string;
  description: string;
}

export default function ContactSection({
  title,
  labelTitle,
  subtitle,
  description,
}: ContactSectionProps) {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28 overflow-hidden">
      <ContactDecorations />

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="lg:pt-6 lg:sticky lg:top-24">
          <Reveal>
            <h2 className="text-sapin font-black mb-4">
              {title}{" "}
              <span className="relative italic whitespace-nowrap">
                <span
                  className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                  aria-hidden="true"
                />
                <span className="relative">{labelTitle}</span>
              </span>
              <br />
              <span className="italic text-peach">{subtitle}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-sapin leading-relaxed">{description}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <Image src={Ecureuil} alt="description" width={200} height={200} className="mx-auto mt-8"/>
          </Reveal>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
