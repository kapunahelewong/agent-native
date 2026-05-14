import { defineAction } from "@agent-native/core";
import { readAppState } from "@agent-native/core/application-state";
import { z } from "zod";

export default defineAction({
  description:
    "See what the user is currently looking at. Returns the current navigation state including the doc page slug if a page is open. Always call this first before taking action.",
  schema: z.object({}),
  http: false,
  run: async () => {
    const navigation = await readAppState("navigation");
    if (!navigation) return "No application state found. Is the app running?";
    return JSON.stringify(navigation, null, 2);
  },
});
