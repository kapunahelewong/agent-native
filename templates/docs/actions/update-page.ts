import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { readRawPage, writePage } from "../server/lib/content.js";

export default defineAction({
  description:
    "Read and update an existing documentation page. Pass the slug to fetch current content, then provide the new content to save.",
  schema: z.object({
    slug: z.string().describe("Page slug, e.g. 'getting-started/introduction'"),
    content: z
      .string()
      .optional()
      .describe(
        "New full MDX content. If omitted, returns the current content so you can review before editing.",
      ),
  }),
  http: false,
  run: async (args) => {
    if (!args.content) {
      try {
        const current = await readRawPage(args.slug);
        return `Current content of ${args.slug}:\n\n${current}`;
      } catch {
        return `Page not found: ${args.slug}`;
      }
    }
    await writePage(args.slug, args.content);
    return `Updated content/${args.slug}.mdx successfully.`;
  },
});
