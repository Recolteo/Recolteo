import Hero from "@/src/components/sections/Hero";
import ContactSection from "@/src/components/sections/ContactSection";

export default function Contact() {
  return (
    <div>
      <Hero
        title="Nous restons"
        subtitle="à votre"
        labelTitle="disposition"
        spanTitle="pour"
        endTitle="toute question"
        description="Contactez-nous via le formulaire ci-dessous, nous vous répondrons rapidement."
        primaryButton="Explorer la plateforme"
        primaryButtonHref="./decouvrir-recolteo"
        secondaryButton="Profiter des offres"
        secondaryButtonHref="./lots"
      />
      <ContactSection
        title="Nous restons à votre"
        labelTitle="entière disposition"
        subtitle="pour toute question"
        description="Contactez-nous via le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais."
      />
    </div>
  );
}
