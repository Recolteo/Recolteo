import Toggle from "@/src/components/ui/primitives/Toggle";

interface CookieCategoryProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  badge?: string;
}

export default function CookieCategory({
  label,
  description,
  checked,
  onChange,
  disabled,
  badge,
}: CookieCategoryProps) {
  const id = `toggle-${label.toLowerCase()}`;
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-sapin/10 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <label
            htmlFor={id}
            className="font-semibold text-sapin text-base cursor-pointer"
          >
            {label}
          </label>
          {badge && (
            <span className="text-xs bg-lime text-sapin font-semibold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-sapin/60 leading-relaxed">{description}</p>
      </div>
      <Toggle
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
