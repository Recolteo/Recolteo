import type { ChangeEventHandler } from "react";

interface InputProps {
  name: string;
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  rows?: number;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  defaultValue?: string | number;
}

const inputClass =
  "px-4 py-3 rounded-xl border-2 border-sapin/20 bg-white focus:border-sapin focus:outline-none transition-colors text-sm font-medium placeholder:text-sapin/30 text-sapin w-full";

export default function Input({
  name,
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  rows,
  required,
  min,
  max,
  defaultValue,
}: InputProps) {
  const field =
    type === "textarea" ? (
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}
        rows={rows ?? 4}
        required={required}
        className={`${inputClass} resize-none`}
      />
    ) : (
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange as ChangeEventHandler<HTMLInputElement>}
        required={required}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className={inputClass}
      />
    );

  if (!label) return field;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-sapin">
        {label}
        {required && <span className="text-peach ml-1">*</span>}
      </label>
      {field}
    </div>
  );
}
