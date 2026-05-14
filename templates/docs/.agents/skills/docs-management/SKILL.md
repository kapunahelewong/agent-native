# Docs Management

How to create, edit, and organize documentation pages.

## Key actions

- `list-pages` — see all pages
- `create-page --slug <slug> --content <mdx>` — create a new page
- `update-page --slug <slug>` — read a page's current content
- `update-page --slug <slug> --content <mdx>` — overwrite a page
- `delete-page --slug <slug>` — remove a page
- `search-docs --query <term>` — full-text search
- `sweep-replace --find <text> --replace <text>` — dry-run sweep
- `sweep-replace --find <text> --replace <text> --dry_run false` — apply sweep
- `update-navigation` — read or update docs.config.json

## Page format

Every page starts with frontmatter:

```mdx
---
title: My Page
description: One-line summary
---

# My Page

Content here.
```

## After creating a page

Always add the slug to the navigation in `docs.config.json` using `update-navigation`.

## Sweep-replace workflow

1. Run `search-docs` to find affected pages
2. Run `sweep-replace` with `dry_run=true` (default) to preview
3. Run `sweep-replace` with `dry_run=false` to apply
