import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { writePage } from "../server/lib/content.js";

export default defineAction({
  description:
    "Create a new documentation page as an MDX file. Provide the slug (path like 'guides/my-guide') and the full MDX content including frontmatter.",
  schema: z.object({
    slug: z
      .string()
      .describe(
        "Page slug — the path under content/, e.g. 'getting-started/installation' or 'api-reference/users'. Use kebab-case.",
      ),
    content: z
      .string()
      .describe(
        "Full MDX content for the page. Start with frontmatter: ---\\ntitle: My Page\\ndescription: One-line summary\\n---\\n\\n# My Page\\n\nContent here...",
      ),
  }),
  http: false,
  run: async (args) => {
    await writePage(args.slug, args.content);
    return `Created content/${args.slug}.mdx. To add it to the navigation, update docs.config.json or ask me to update the navigation.`;
  },
});
