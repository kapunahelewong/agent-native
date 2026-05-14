import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { listAllPages } from "../server/lib/content.js";

export default defineAction({
  description: "List all documentation pages with their slugs, titles, and descriptions.",
  schema: z.object({}),
  http: false,
  run: async () => {
    const pages = await listAllPages();
    if (pages.length === 0) return "No pages found. Create one with create-page.";
    return pages
      .map((p) => `${p.slug}: ${p.title}${p.description ? ` — ${p.description}` : ""}`)
      .join("\n");
  },
});
