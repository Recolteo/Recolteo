import Btn from "../ui/primitives/Button";
import Reveal from "../animations/Reveal";
import { HeroDecorations } from "../illustrations/assetsIllustrations";

interface HeroProps {
  title: string;
  subtitle: string;
  labelTitle: string;
  spanTitle: string;
  endTitle: string;
  description: string;
  primaryButton: string;
  primaryButtonHref: string;
  secondaryButton: string;
  secondaryButtonHref: string;
}

export default function Hero({
  title,
  subtitle,
  labelTitle,
  spanTitle,
  endTitle,
  description,
  primaryButton,
  primaryButtonHref,
  secondaryButton,
  secondaryButtonHref,
}: HeroProps) {
  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
      <HeroDecorations />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <Reveal delay={0.5}>
          <h1 className="text-sapin font-black mb-6">
            {title}
            <br />
            {subtitle}{" "}
            <span className="relative italic whitespace-nowrap">
              <span
                className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                aria-hidden="true"
              />
              <span className="relative">{labelTitle}</span>
            </span>
            <br />
            <span className="italic text-peach">{spanTitle}</span> {endTitle}
          </h1>
        </Reveal>

        <Reveal delay={0.75}>
          <p className="text-sapin max-w-xl mx-auto mb-10">{description}</p>
        </Reveal>

        <Reveal delay={1}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Btn
              label={primaryButton}
              href={primaryButtonHref}
              variant="sapin"
            />
            <Btn
              label={secondaryButton}
              href={secondaryButtonHref}
              variant="peach"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
