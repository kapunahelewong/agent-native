# Agent-Native Docs — Agent Guide

This is a documentation template. Content lives in MDX files; navigation is in `docs.config.json`.

## Actions

| Action | Description |
|--------|-------------|
| `view-screen` | See the current page slug the user is viewing |
| `navigate --slug <slug>` | Open a doc page in the UI |
| `list-pages` | List all pages with titles and descriptions |
| `create-page --slug <slug> --content <mdx>` | Create a new .mdx file |
| `update-page --slug <slug>` | Read current content (omit --content) |
| `update-page --slug <slug> --content <mdx>` | Overwrite a page with new content |
| `delete-page --slug <slug>` | Delete a page permanently |
| `search-docs --query <term>` | Full-text search across all pages |
| `sweep-replace --find <text> --replace <text>` | Dry-run find & replace across all pages |
| `sweep-replace --find <text> --replace <text> --dry_run false` | Apply the sweep |
| `update-navigation` | Read or update docs.config.json |

## Content structure

```
content/
  getting-started/
    introduction.mdx
    quickstart.mdx
    installation.mdx
  guides/
    writing-docs.mdx
    components.mdx
    navigation.mdx
  api-reference/
    overview.mdx
    authentication.mdx
    endpoints.mdx
```

All files use `.mdx` extension. Slugs are the file path under `content/`, without `.mdx`.

## Page format

```mdx
---
title: Page Title
description: One-line summary.
---

Content here in MDX.
```

## Available components in MDX

```mdx
<Note>...</Note>
<Tip>...</Tip>
<Warning>...</Warning>
<Danger>...</Danger>
<Success>...</Success>

<Steps>
  <Step title="Step 1">...</Step>
</Steps>

<Tabs>
  <Tab title="JS">...</Tab>
</Tabs>

<Card title="..." description="..." href="/docs/..." />
<CardGroup cols={2}>...</CardGroup>

<Accordion>
  <AccordionItem title="Q?">A</AccordionItem>
</Accordion>

<Badge variant="success">New</Badge>

<ApiEndpoint method="GET" path="/endpoint" description="..." />
```

## Navigation config

`docs.config.json` controls sidebar groups, top nav links, site title, and footer.

## Writing style defaults

- Second person ("you"), not first person ("we")
- Active voice
- Concise sentences
- Code examples for technical content
