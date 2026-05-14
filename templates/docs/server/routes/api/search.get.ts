import { defineEventHandler, getQuery, createError } from "h3";
import { searchPages } from "../../lib/content.js";

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event) as { q?: string };
  if (!q?.trim()) throw createError({ statusCode: 400, message: "Missing q query param" });

  return searchPages(q.trim());
});
