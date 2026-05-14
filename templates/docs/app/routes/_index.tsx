import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import docsConfig from "../../docs.config.json";
import { flattenNavPages } from "@/lib/navigation";

export async function loader(_args: LoaderFunctionArgs) {
  const pages = flattenNavPages(docsConfig.navigation);
  const first = pages[0];
  if (first) throw redirect(`/docs/${first}`);
  return {};
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">No documentation pages found. Ask the agent to create one!</p>
    </div>
  );
}
