import { ArrowLeft, ArrowRight } from "@deemlol/next-icons";

const NAV_BTN =
  "w-9 h-9 flex items-center justify-center rounded-xl bg-white border-2 border-sapin/30 text-sapin/70 hover:border-sapin/60 hover:text-sapin disabled:opacity-25 disabled:pointer-events-none transition-all";

function NavButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={NAV_BTN}
      aria-label={label}
    >
      {children}
    </button>
  );
}

function getPageItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const around: number[] = [];
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    around.push(i);
  }

  const items: (number | "…")[] = [1];
  if (around[0] > 2) items.push("…");
  items.push(...around);
  if (around[around.length - 1] < total - 1) items.push("…");
  items.push(total);
  return items;
}

export default function Pagination({
  page,
  totalPages,
  goToPage,
}: {
  page: number;
  totalPages: number;
  goToPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 flex-wrap"
    >
      <NavButton
        label="Page précédente"
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
      >
        <ArrowLeft size={20} />
      </NavButton>

      {getPageItems(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-sapin/40 text-sm font-bold select-none"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => goToPage(item)}
            aria-current={item === page ? "page" : undefined}
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
              item === page
                ? "bg-sapin text-cream shadow-[2px_2px_0_0_#04251c]"
                : "bg-white border-2 border-sapin/30 text-sapin/75 hover:border-sapin/60 hover:text-sapin"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <NavButton
        label="Page suivante"
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
      >
        <ArrowRight size={20} />
      </NavButton>
    </nav>
  );
}
