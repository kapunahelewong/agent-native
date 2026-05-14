export interface NavPage {
  slug: string;
  label?: string;
}

export interface NavGroup {
  group: string;
  pages: (string | NavPage)[];
}

export interface TopNavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface DocsConfig {
  title: string;
  description?: string;
  logo?: { text?: string; src?: string };
  navigation: NavGroup[];
  topNav?: TopNavItem[];
  footer?: { links: { label: string; href: string }[] };
}

export function slugToLabel(slug: string): string {
  const name = slug.split("/").pop() ?? slug;
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function flattenNavPages(nav: NavGroup[]): string[] {
  return nav.flatMap((group) =>
    group.pages.map((p) => (typeof p === "string" ? p : p.slug)),
  );
}

export function findAdjacentPages(
  currentSlug: string,
  nav: NavGroup[],
): { prev: string | null; next: string | null } {
  const pages = flattenNavPages(nav);
  const idx = pages.indexOf(currentSlug);
  return {
    prev: idx > 0 ? pages[idx - 1] : null,
    next: idx < pages.length - 1 ? pages[idx + 1] : null,
  };
}
