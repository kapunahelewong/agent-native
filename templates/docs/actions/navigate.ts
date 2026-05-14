import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { writeAppState } from "@agent-native/core/application-state";

export default defineAction({
  description:
    "Navigate the UI to a specific doc page or path. Opens the page in the viewer.",
  schema: z.object({
    slug: z.string().optional().describe("Doc page slug, e.g. getting-started/introduction"),
    path: z.string().optional().describe("Full URL path, e.g. /docs/guides/writing-docs"),
  }),
  http: false,
  run: async (args) => {
    if (!args.slug && !args.path) {
      return "Error: Provide --slug or --path.";
    }
    const nav: Record<string, string> = {};
    if (args.slug) nav.slug = args.slug;
    if (args.path) nav.path = args.path;
    await writeAppState("navigate", nav);
    return `Navigating to ${args.slug ?? args.path}`;
  },
});
