import { defineEventHandler, getQuery, createError } from "h3";
import { compilePage } from "../../lib/content.js";

export default defineEventHandler(async (event) => {
  const { slug } = getQuery(event) as { slug?: string };
  if (!slug) throw createError({ statusCode: 400, message: "Missing slug query param" });

  try {
    return await compilePage(slug);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      throw createError({ statusCode: 404, message: `Page not found: ${slug}` });
    }
    throw err;
  }
});
