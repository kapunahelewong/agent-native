import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { IconSearch, IconSun, IconMoon, IconMenu2, IconX } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { AgentToggleButton } from "@agent-native/core/client";
import { cn } from "@/lib/utils";
import type { DocsConfig } from "@/lib/navigation";

interface HeaderProps {
  config: DocsConfig;
  onOpenMobileSidebar: () => void;
}

export function Header({ config, onOpenMobileSidebar }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
        setResults([]);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
        setResults([]);
      }
    }
    if (searchOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) setResults(await res.json());
      } catch {
        // ignore
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 gap-3">
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
        aria-label="Open navigation"
      >
        <IconMenu2 className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-semibold text-foreground">{config.logo?.text ?? config.title}</span>
      </div>

      <nav className="hidden md:flex items-center gap-1 ml-4">
        {config.topNav?.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="relative" ref={searchRef}>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-muted text-muted-foreground text-sm hover:bg-accent hover:text-foreground transition-colors w-48 md:w-56"
        >
          <IconSearch className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">Search docs…</span>
          <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] opacity-70">
            ⌘K
          </kbd>
        </button>

        {searchOpen && (
          <div className="absolute right-0 top-10 w-[420px] rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <IconSearch className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search documentation…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <IconX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {results.length > 0 ? (
                <ul>
                  {results.map((r) => (
                    <li key={r.slug}>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/docs/${r.slug}`);
                          setSearchOpen(false);
                          setQuery("");
                          setResults([]);
                        }}
                        className="w-full flex flex-col gap-0.5 px-4 py-3 text-left hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{r.title}</span>
                        {r.excerpt && (
                          <span className="text-xs text-muted-foreground line-clamp-2">{r.excerpt}</span>
                        )}
                        <span className="text-xs text-muted-foreground/60">{r.slug}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">No results for "{query}"</p>
              ) : (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">Type to search…</p>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
        aria-label="Toggle theme"
      >
        {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
      </button>

      <AgentToggleButton />
    </header>
  );
}

interface SearchResult {
  slug: string;
  title: string;
  excerpt?: string;
}
