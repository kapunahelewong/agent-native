import { defineEventHandler, readBody } from "h3";
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const CONFIG_PATH = join(dirname(fileURLToPath(import.meta.url)), "../../../../docs.config.json");

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  await writeFile(CONFIG_PATH, JSON.stringify(body, null, 2), "utf-8");
  return { ok: true };
});
