import { defineEventHandler, getQuery, readBody, createError } from "h3";
import { writePage } from "../../lib/content.js";

export default defineEventHandler(async (event) => {
  const { slug } = getQuery(event) as { slug?: string };
  if (!slug) throw createError({ statusCode: 400, message: "Missing slug query param" });

  const { content } = await readBody<{ content: string }>(event);
  if (typeof content !== "string") {
    throw createError({ statusCode: 400, message: "Missing content in body" });
  }

  await writePage(slug, content);
  return { ok: true };
});
