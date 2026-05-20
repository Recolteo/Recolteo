import Button from "../primitives/Button";
import {
  Star,
  CircleDecor,
  LeafFull,
} from "../../illustrations/assetsIllustrations";

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
    <div className="relative bg-sapin border border-sapin rounded-2xl shadow-[4px_4px_0_0_#04251c] px-8 py-12 sm:px-14 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute top-3 left-5 w-4 sm:w-5">
          <Star color="#c9f242" />
        </div>
        <div className="absolute -bottom-5 -left-4 w-16 sm:w-20 opacity-40">
          <LeafFull />
        </div>
        <div className="sm:block absolute -top-10 right-[16%] w-44 opacity-[0.18]">
          <CircleDecor color="#c9f242" />
        </div>
        <div className="hidden sm:block absolute bottom-3 right-[28%] w-4">
          <Star color="#c9f242" />
        </div>
        <div className="hidden sm:block absolute top-[40%] right-[2.5%] w-5 opacity-80">
          <Star color="#f16012" />
        </div>
        <div className="hidden sm:block absolute bottom-[-25%] left-[33%] w-16 opacity-40">
          <CircleDecor color="#f16012" />
        </div>
      </div>

      <div className="relative z-10 text-center sm:text-left">
        <p className="text-lime font-black text-2xl sm:text-3xl leading-snug mb-2">
          {heading}
        </p>
        <p className="text-cream text-base">{subheading}</p>
      </div>
      <Button label={buttonLabel} href={buttonHref} variant="lime" />
    </div>
  );
}
