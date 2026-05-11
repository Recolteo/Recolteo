interface HeroProps {
  title: string;
  subtitle: string;
  labelTitle: string;
  spanTitle: string;
  endTitle: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
}

export default function Hero({
  title,
  subtitle,
  labelTitle,
  spanTitle,
  endTitle,
  description,
  primaryButton,
  secondaryButton,
}: HeroProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
      <div className="max-w-3xl mx-auto text-center">
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

        <p className="text-sapin max-w-xl mx-auto mb-10">{description}</p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button>{primaryButton}</button>
          <button>{secondaryButton}</button>
        </div>
      </div>
    </section>
  );
}
