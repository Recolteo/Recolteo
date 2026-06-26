import type { AdminFilter } from "./types";

export function adminNavigate(
  router: { push: (url: string) => void; replace: (url: string) => void },
  pathname: string,
  filter: AdminFilter,
  page: number,
  search?: string,
  replace?: boolean,
) {
  const params = new URLSearchParams({ filter, page: String(page) });
  if (search) params.set("search", search);
  const url = `${pathname}?${params.toString()}`;
  if (replace) router.replace(url);
  else router.push(url);
}
