"use client";

export const RADIUS_STEPS = [1, 5, 10, 25, 50, 100] as const;

const STEPS_WITH_OFF = ["off", ...RADIUS_STEPS] as const;

interface RadiusSliderProps {
  value: number;
  onChange: (index: number) => void;
  withOff?: boolean;
  disabled?: boolean;
}

export default function RadiusSlider({ value, onChange, withOff, disabled }: RadiusSliderProps) {
  const steps = withOff ? STEPS_WITH_OFF : RADIUS_STEPS;
  const max = steps.length - 1;
  const percent = (value / max) * 100;
  const isOff = withOff && value === 0;
  const km = isOff ? null : RADIUS_STEPS[withOff ? value - 1 : value];

  return (
    <div className={`flex flex-col gap-2 w-full transition-opacity ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-sapin">Rayon de recherche</span>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
            isOff
              ? "text-sapin/50 bg-sapin/8 border-sapin/20"
              : "text-sapin bg-lime/50 border-lime"
          }`}
        >
          {isOff ? "Désactivé" : `${km} km`}
        </span>
      </div>

      <div className="relative h-10 flex items-center select-none">
        <div className="absolute w-full h-1.5 bg-sapin/10 rounded-full" />
        <div
          className={`absolute h-1.5 rounded-full transition-all duration-150 ${isOff ? "bg-sapin/20" : "bg-sapin"}`}
          style={{ width: `${percent}%` }}
        />
        <div
          className={`absolute w-5 h-5 rounded-full border-2 shadow-md -translate-x-1/2 transition-all duration-150 pointer-events-none ${
            isOff ? "bg-sapin/30 border-cream" : "bg-sapin border-cream"
          }`}
          style={{ left: `${percent}%` }}
        />
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute w-full h-10 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label={isOff ? "Filtre de rayon désactivé" : `Rayon de recherche : ${km} km`}
        />
      </div>

      <div className="flex justify-between px-0">
        {steps.map((step, i) => (
          <span
            key={i}
            className={`text-sm font-bold leading-none ${
              value === i ? "text-sapin" : "text-sapin/40"
            }`}
          >
            {step === "off" ? "—" : step}
          </span>
        ))}
      </div>
    </div>
  );
}
