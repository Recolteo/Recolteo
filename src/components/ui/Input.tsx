import type { ChangeEventHandler } from "react";

interface InputProps {
  type: "text" | "email" | "textarea";
  name: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  rows?: number;
  required?: boolean;
}

export default function Input({ type, name, placeholder, value, onChange, rows, required }: InputProps) {
  const shared = {
    name,
    placeholder,
    value,
    onChange,
    required,
    className:
      "border border-sapin/20 rounded-lg px-4 py-3 text-sapin placeholder:text-sapin/30 text-sm focus:outline-none focus:border-sapin/60 transition-colors bg-transparent",
  };

  return type === "textarea" ? (
    <textarea {...shared} rows={rows ?? 4} className={`${shared.className} resize-none`} />
  ) : (
    <input type={type} {...shared} />
  );
}