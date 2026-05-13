import Button from "./Button";

interface CtaBannerProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
}

export default function CtaBanner({
  heading,
  subheading,
  buttonLabel,
  buttonHref,
}: CtaBannerProps) {
  return (
    <div className="bg-sapin rounded-3xl px-8 py-12 sm:px-14 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="text-center sm:text-left">
        <p className="text-lime font-black text-2xl sm:text-3xl leading-snug mb-2">
          {heading}
        </p>
        <p className="text-cream/60 text-sm">{subheading}</p>
      </div>
      <Button label={buttonLabel} href={buttonHref} variant="lime" />
    </div>
  );
}
