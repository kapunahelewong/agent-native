# Docs — Development Guide

This guide is for development-mode agents editing this app's source code. For app operations and tools, see AGENTS.md.

## Tech Stack

- **Framework:** @agent-native/core + React Router v7 (framework mode)
- **Frontend:** React 19, Vite, TailwindCSS, shadcn/ui
- **Content:** MDX files compiled at runtime with `@mdx-js/mdx`
- **Routing:** File-based via `flatRoutes()` — SSR shell + client rendering
- **Backend:** Nitro (via @agent-native/core) — file-based API routing

## Commands

- **Dev:** `pnpm dev`
- **Build:** `pnpm build`
- **Start:** `node .output/server/index.mjs`

## Directory Structure

```
app/                   # React frontend
  components/
    docs/              # MDX components (Callout, CodeBlock, Steps, Tabs, Card, etc.)
    layout/            # DocsLayout, DocsSidebar, Header, TableOfContents
  routes/
    _index.tsx         # Redirects to first doc page
    docs.$.tsx         # Dynamic doc page — fetches compiled MDX from server
  lib/navigation.ts    # Navigation config types and utilities

content/               # MDX source files (the actual docs)
  getting-started/
  guides/
  api-reference/

server/
  lib/content.ts       # compilePage, writePage, searchPages, sweepReplace
  routes/api/          # REST endpoints for content, search, navigation
  plugins/             # agent-chat.ts, auth.ts

actions/               # Agent-callable scripts
docs.config.json       # Navigation and site config
```

## Content rendering pipeline

1. Client requests `/docs/<slug>`
2. `docs.$.tsx` loader calls `/api/content?slug=<slug>`
3. Server reads `content/<slug>.mdx`, parses frontmatter with `gray-matter`
4. Compiles MDX to function-body string with `@mdx-js/mdx`
5. Returns `{ code, frontmatter, tocEntries }` as JSON
6. Client calls `run(code, runtime)` from `@mdx-js/mdx` to get a React component
7. Renders with `<MDXProvider components={docsComponents}>`

## Adding a new component

1. Create the component in `app/components/docs/`
2. Register it in `app/components/docs/MDXComponents.tsx`
3. Document it in `content/guides/components.mdx`

## Search

`server/lib/content.ts` implements full-text search by reading all MDX files, stripping markdown syntax, and searching the plain text. No external search service needed.

## Sweep-replace

`actions/sweep-replace.ts` calls `sweepReplace()` from `server/lib/content.ts`. It always runs as a dry run by default — pass `dry_run=false` to apply.
