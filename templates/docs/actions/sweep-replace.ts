import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { sweepReplace } from "../server/lib/content.js";

export default defineAction({
  description:
    "Find a word or phrase across ALL documentation pages and replace it. Use this for style sweeps (e.g. changing 'we' to 'you'), fixing product name capitalization, updating outdated terminology, or bulk edits. Run with dry_run=true first to preview what will change.",
  schema: z.object({
    find: z.string().describe("Text to find (exact string, not regex)"),
    replace: z.string().describe("Text to replace it with"),
    dry_run: z
      .boolean()
      .optional()
      .default(true)
      .describe(
        "If true (default), previews changes without saving. Set to false to apply.",
      ),
    case_sensitive: z
      .boolean()
      .optional()
      .default(false)
      .describe("If true, match is case-sensitive. Default: false."),
  }),
  http: false,
  run: async (args) => {
    const results = await sweepReplace(args.find, args.replace, {
      caseSensitive: args.case_sensitive,
      dryRun: args.dry_run,
    });

    if (results.length === 0) {
      return `No occurrences of "${args.find}" found across any pages.`;
    }

    const totalMatches = results.reduce((sum, r) => sum + r.matchCount, 0);
    const mode = args.dry_run ? "DRY RUN — no changes saved" : "APPLIED — files updated";

    const lines = [
      `${mode}`,
      `Found "${args.find}" → "${args.replace}" in ${results.length} page(s), ${totalMatches} total occurrence(s):\n`,
      ...results.map(
        (r) =>
          `  [${r.slug}] ${r.matchCount} match(es)\n  Context: …${r.preview}…`,
      ),
    ];

    if (args.dry_run) {
      lines.push(`\nTo apply these changes, call sweep-replace again with dry_run=false.`);
    }

    return lines.join("\n");
  },
});
