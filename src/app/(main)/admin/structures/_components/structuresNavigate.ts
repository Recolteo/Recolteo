import type { StructureFilter } from "./types";

export function structuresNavigate(
  router: { push: (url: string) => void },
  pathname: string,
  filter: StructureFilter,
  page: number,
) {
  const params = new URLSearchParams({ filter, page: String(page) });
  router.push(`${pathname}?${params.toString()}`);
}
