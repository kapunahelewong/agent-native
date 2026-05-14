import { readFile, writeFile, unlink, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

// Resolve content dir relative to this file (server/lib/ → ../../content)
const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../content");

export interface PageMeta {
  slug: string;
  title: string;
  description?: string;
  [key: string]: unknown;
}

export interface CompiledPage {
  slug: string;
  code: string;
  frontmatter: Record<string, string>;
  tocEntries: TocEntry[];
  rawContent: string;
}

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export async function compilePage(slug: string): Promise<CompiledPage> {
  const filePath = join(CONTENT_DIR, `${slug}.mdx`);
  const raw = await readFile(filePath, "utf-8");
  const { content, data: frontmatter } = matter(raw);

  const compiled = await compile(content, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });

  const tocEntries = extractTocFromMarkdown(content);

  return {
    slug,
    code: String(compiled),
    frontmatter: frontmatter as Record<string, string>,
    tocEntries,
    rawContent: content,
  };
}

export async function getPageMeta(slug: string): Promise<PageMeta | null> {
  const filePath = join(CONTENT_DIR, `${slug}.mdx`);
  if (!existsSync(filePath)) return null;
  const raw = await readFile(filePath, "utf-8");
  const { data } = matter(raw);
  return {
    slug,
    title: (data.title as string) ?? slugToLabel(slug),
    description: data.description as string | undefined,
    ...data,
  };
}

export async function writePage(slug: string, content: string): Promise<void> {
  const filePath = join(CONTENT_DIR, `${slug}.mdx`);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf-8");
}

export async function deletePage(slug: string): Promise<void> {
  const filePath = join(CONTENT_DIR, `${slug}.mdx`);
  await unlink(filePath);
}

export async function listAllPages(): Promise<PageMeta[]> {
  const pages: PageMeta[] = [];
  await walkDir(CONTENT_DIR, CONTENT_DIR, pages);
  return pages;
}

async function walkDir(base: string, dir: string, pages: PageMeta[]): Promise<void> {
  if (!existsSync(dir)) return;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(base, full, pages);
    } else if (entry.name.endsWith(".mdx")) {
      const slug = full.slice(base.length + 1).replace(/\.mdx$/, "").replace(/\\/g, "/");
      const raw = await readFile(full, "utf-8");
      const { data } = matter(raw);
      pages.push({
        slug,
        title: (data.title as string) ?? slugToLabel(slug),
        description: data.description as string | undefined,
        ...data,
      });
    }
  }
}

export async function readRawPage(slug: string): Promise<string> {
  return readFile(join(CONTENT_DIR, `${slug}.mdx`), "utf-8");
}

export async function searchPages(query: string): Promise<Array<{ slug: string; title: string; excerpt: string }>> {
  const pages: PageMeta[] = [];
  await walkDir(CONTENT_DIR, CONTENT_DIR, pages);
  const q = query.toLowerCase();
  const results: Array<{ slug: string; title: string; excerpt: string }> = [];

  for (const page of pages) {
    try {
      const raw = await readFile(join(CONTENT_DIR, `${page.slug}.mdx`), "utf-8");
      const { content } = matter(raw);
      const text = stripMdx(content);
      const idx = text.toLowerCase().indexOf(q);
      if (idx !== -1) {
        const start = Math.max(0, idx - 60);
        const end = Math.min(text.length, idx + q.length + 120);
        const excerpt = (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
        results.push({ slug: page.slug, title: page.title, excerpt });
      } else if (page.title.toLowerCase().includes(q)) {
        results.push({ slug: page.slug, title: page.title, excerpt: page.description ?? "" });
      }
    } catch {
      // skip unreadable pages
    }
  }
  return results.slice(0, 20);
}

export async function sweepReplace(
  find: string,
  replace: string,
  options: { caseSensitive?: boolean; dryRun?: boolean } = {},
): Promise<Array<{ slug: string; matchCount: number; preview?: string }>> {
  const { caseSensitive = false, dryRun = false } = options;
  const pages: PageMeta[] = [];
  await walkDir(CONTENT_DIR, CONTENT_DIR, pages);
  const results: Array<{ slug: string; matchCount: number; preview?: string }> = [];

  const flags = caseSensitive ? "g" : "gi";
  const regex = new RegExp(escapeRegex(find), flags);

  for (const page of pages) {
    const filePath = join(CONTENT_DIR, `${page.slug}.mdx`);
    try {
      const raw = await readFile(filePath, "utf-8");
      const matches = raw.match(regex);
      if (!matches) continue;
      const matchCount = matches.length;
      const updated = raw.replace(regex, replace);
      if (!dryRun) {
        await writeFile(filePath, updated, "utf-8");
      }
      // Build a short preview of the first replacement context
      const firstIdx = raw.search(regex);
      const start = Math.max(0, firstIdx - 40);
      const end = Math.min(raw.length, firstIdx + find.length + 80);
      const preview = raw.slice(start, end).replace(/\n/g, " ");
      results.push({ slug: page.slug, matchCount, preview });
    } catch {
      // skip
    }
  }
  return results;
}

function extractTocFromMarkdown(content: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*|__|\*|_|`/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      entries.push({ id, text, level });
    }
  }
  return entries;
}

function stripMdx(content: string): string {
  return content
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/[#*_[\]()>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugToLabel(slug: string): string {
  const name = slug.split("/").pop() ?? slug;
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
