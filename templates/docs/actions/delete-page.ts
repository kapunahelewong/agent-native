import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { deletePage } from "../server/lib/content.js";

export default defineAction({
  description: "Delete a documentation page by slug. This is permanent.",
  schema: z.object({
    slug: z.string().describe("Page slug to delete, e.g. 'guides/old-guide'"),
  }),
  http: false,
  run: async (args) => {
    await deletePage(args.slug);
    return `Deleted content/${args.slug}.mdx. Remember to remove it from docs.config.json navigation if it was listed there.`;
  },
});
