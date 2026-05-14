import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { slugToLabel, type DocsConfig } from "@/lib/navigation";

interface DocsSidebarProps {
  config: DocsConfig;
}

export function DocsSidebar({ config }: DocsSidebarProps) {
  const location = useLocation();
  const currentSlug = location.pathname.replace(/^\/docs\//, "");

  return (
    <nav className="w-64 shrink-0 overflow-y-auto py-6 pr-4 pl-4 hidden md:block">
      <div className="space-y-6">
        {config.navigation.map((group) => (
          <div key={group.group}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.pages.map((page) => {
                const slug = typeof page === "string" ? page : page.slug;
                const label =
                  typeof page === "string"
                    ? slugToLabel(slug)
                    : (page.label ?? slugToLabel(slug));
                const isActive = currentSlug === slug;
                return (
                  <li key={slug}>
                    <Link
                      to={`/docs/${slug}`}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
