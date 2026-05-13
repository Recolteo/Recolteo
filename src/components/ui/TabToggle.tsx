"use client";

import { motion } from "motion/react";

interface Tab {
  value: string;
  label: string;
}

interface TabToggleProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
}

export default function TabToggle({ tabs, active, onChange }: TabToggleProps) {
  return (
    <div className="relative flex gap-1 bg-sapin/6 rounded-2xl p-1.5 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className="relative px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          {active === tab.value && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute inset-0 bg-sapin rounded-xl shadow-sm"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          <span
            className={`relative z-10 transition-colors duration-200 ${
              active === tab.value ? "text-cream" : "text-sapin"
            }`}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
