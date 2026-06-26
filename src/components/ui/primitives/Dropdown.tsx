"use client";

import { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  placeholder?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

const TRIGGER_CLASS =
  "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-sapin/20 bg-white hover:border-sapin focus:border-sapin focus:outline-none transition-colors text-sm font-medium cursor-pointer";

export default function Dropdown({
  value,
  placeholder = "Choisir…",
  options,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className={TRIGGER_CLASS}>
        <span className={selected ? "text-sapin" : "text-sapin/40"}>
          {selected?.label ?? placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-sapin/60 transition-transform duration-200${open ? " rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border border-sapin/10 overflow-y-auto max-h-50">
          {options.map((option, i) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={[
                  "w-full text-left px-4 py-3 text-sm font-medium text-sapin hover:bg-sapin/5 transition-colors",
                  i !== options.length - 1 ? "border-b border-sapin/8" : "",
                  value === option.value ? "bg-sapin/5" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
