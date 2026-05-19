import type { AdminFilter } from "./types";

export function adminNavigate(
  router: { push: (url: string) => void },
  pathname: string,
  filter: AdminFilter,
  page: number,
) {
  const params = new URLSearchParams({ filter, page: String(page) });
  router.push(`${pathname}?${params.toString()}`);
}
