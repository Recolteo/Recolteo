import Hero from "@/src/components/sections/Hero";
import ContactForm from "@/src/components/sections/ContactForm";

export default function Contact() {
  return (
    <div>
      <Hero
        title="Nous restons"
        subtitle="à votre"
        labelTitle="disposition"
        spanTitle="pour"
        endTitle="toute questions"
        description="Contactez-nous via le formulaire ci-dessous, nous vous répondrons rapidement."
        primaryButton="Explorer la plateforme"
        primaryButtonHref="./decouvrir-recolteo"
        secondaryButton="Profiter des offres"
        secondaryButtonHref="./dashboard"
      />
      <ContactForm />
    </div>
  );
}