import { defineEventHandler, getQuery, createError } from "h3";
import { deletePage } from "../../lib/content.js";

export default defineEventHandler(async (event) => {
  const { slug } = getQuery(event) as { slug?: string };
  if (!slug) throw createError({ statusCode: 400, message: "Missing slug query param" });

  await deletePage(slug);
  return { ok: true };
});
