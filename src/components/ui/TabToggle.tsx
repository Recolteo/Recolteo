"use client";

interface Tab {
  value: string;
  label: string;
}

interface TabToggleProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

export default function TabToggle({
  tabs,
  active,
  onChange,
  fullWidth,
}: TabToggleProps) {
  const activeIndex = tabs.findIndex((t) => t.value === active);
  const n = tabs.length;

  return (
    <div
      className={`relative flex gap-1 bg-sapin/6 rounded-2xl p-1.5 ${fullWidth ? "w-full" : "w-fit"}`}
    >
      <span
        aria-hidden="true"
        className="absolute top-1.5 bottom-1.5 bg-sapin rounded-xl shadow-sm pointer-events-none transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          left: "6px",
          width: `calc((100% - 12px - ${(n - 1) * 4}px) / ${n})`,
          transform: `translateX(calc(${activeIndex} * (100% + 4px)))`,
        }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`relative z-10 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${
            fullWidth ? "flex-1 px-2" : "px-5"
          } ${active === tab.value ? "text-cream" : "text-sapin"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
