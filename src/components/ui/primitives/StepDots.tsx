interface StepDotsProps {
  count: number;
  current: number;
  onGoTo: (i: number) => void;
}

export default function StepDots({ count, current, onGoTo }: StepDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={() => i !== current && onGoTo(i)}
          aria-label={`Étape ${i + 1}`}
          className={`h-3 rounded-full transition-all duration-300 ${
            i === current
              ? "w-6 bg-sapin cursor-default"
              : "w-3 bg-sapin/40 cursor-pointer hover:bg-sapin hover:scale-110"
          }`}
        />
      ))}
    </div>
  );
}
