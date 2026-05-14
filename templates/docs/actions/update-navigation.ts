import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const CONFIG_PATH = join(dirname(fileURLToPath(import.meta.url)), "../docs.config.json");

const NavPageSchema = z.union([
  z.string(),
  z.object({ slug: z.string(), label: z.string().optional() }),
]);

const NavGroupSchema = z.object({
  group: z.string(),
  pages: z.array(NavPageSchema),
});

export default defineAction({
  description:
    "Read or update the docs navigation config (docs.config.json). Pass navigation to update it; omit to read the current config.",
  schema: z.object({
    navigation: z
      .array(NavGroupSchema)
      .optional()
      .describe(
        "New navigation structure. Each group has a 'group' name and 'pages' list of slugs.",
      ),
    title: z.string().optional().describe("Site title (optional)"),
  }),
  http: false,
  run: async (args) => {
    const current = JSON.parse(await readFile(CONFIG_PATH, "utf-8"));

    if (!args.navigation && !args.title) {
      return `Current navigation config:\n${JSON.stringify(current, null, 2)}`;
    }

    const updated = {
      ...current,
      ...(args.title ? { title: args.title } : {}),
      ...(args.navigation ? { navigation: args.navigation } : {}),
    };
    await writeFile(CONFIG_PATH, JSON.stringify(updated, null, 2), "utf-8");
    return `Updated docs.config.json successfully.`;
  },
});
