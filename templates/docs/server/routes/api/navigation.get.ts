import { defineEventHandler } from "h3";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const CONFIG_PATH = join(dirname(fileURLToPath(import.meta.url)), "../../../../docs.config.json");

export default defineEventHandler(async () => {
  const raw = await readFile(CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
});
