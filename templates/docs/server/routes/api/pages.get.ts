import { defineEventHandler } from "h3";
import { listAllPages } from "../../lib/content.js";

export default defineEventHandler(async () => {
  return listAllPages();
});
