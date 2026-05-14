import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { searchPages } from "../server/lib/content.js";

export default defineAction({
  description:
    "Search all documentation pages for a word or phrase. Returns matching pages with excerpt context. Use this to find pages that use certain terminology, check for consistency, or locate content before editing.",
  schema: z.object({
    query: z.string().describe("Word or phrase to search for"),
  }),
  http: false,
  run: async (args) => {
    const results = await searchPages(args.query);
    if (results.length === 0) {
      return `No pages found containing "${args.query}".`;
    }
    return results
      .map((r) => `[${r.slug}] ${r.title}\n  …${r.excerpt}…`)
      .join("\n\n");
  },
});
