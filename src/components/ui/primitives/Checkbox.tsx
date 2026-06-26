"use client";

interface CheckboxProps {
  id: string;
  name?: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Checkbox({
  id,
  name,
  label,
  description,
  checked,
  onChange,
  disabled,
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer group"}`}
    >
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            checked
              ? "bg-sapin border-sapin"
              : "bg-white border-sapin/25 group-hover:border-sapin/50"
          }`}
        >
          {checked && (
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path
                d="M1 3.5L4 6.5L10 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-sapin leading-snug">{label}</span>
        {description && (
          <span className="text-xs text-sapin/50 leading-snug">{description}</span>
        )}
      </span>
    </label>
  );
}
