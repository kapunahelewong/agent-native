import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  entries: TocEntry[];
}

export function TableOfContents({ entries }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (entries.length === 0) return;
    const headingIds = entries.map((e) => e.id);
    const observer = new IntersectionObserver(
      (obs) => {
        for (const entry of obs) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0% 0% -70% 0%", threshold: 0 },
    );

    headingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <aside className="hidden xl:block w-52 shrink-0 py-6 pl-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.id} style={{ paddingLeft: `${(entry.level - 2) * 12}px` }}>
            <a
              href={`#${entry.id}`}
              className={cn(
                "block text-sm py-0.5 transition-colors",
                activeId === entry.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(entry.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(entry.id);
              }}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function extractToc(html: string): TocEntry[] {
  if (typeof document === "undefined") return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const entries: TocEntry[] = [];
  div.querySelectorAll("h2, h3, h4").forEach((el) => {
    const id = el.id;
    const text = el.textContent ?? "";
    const level = parseInt(el.tagName[1], 10);
    if (id) entries.push({ id, text, level });
  });
  return entries;
}
