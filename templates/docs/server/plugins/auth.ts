import { createAuthPlugin } from "@agent-native/core/server";

export default createAuthPlugin({
  marketing: {
    appName: "Agent-Native Docs",
    tagline:
      "Beautiful documentation with AI-powered editing, search, and content management.",
    features: [
      "Ask the agent to create, edit, or restructure any page",
      "Sweep the entire docs for a word and replace it intelligently",
      "Reusable components: callouts, code blocks, steps, tabs, and more",
    ],
  },
});
