import { useLoaderData, Link } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useEffect, useState, useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import { run } from "@mdx-js/mdx";
import { useQuery } from "@tanstack/react-query";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents, type TocEntry } from "@/components/layout/TableOfContents";
import { docsComponents } from "@/components/docs/MDXComponents";
import { slugToLabel, findAdjacentPages } from "@/lib/navigation";
import type { DocsConfig } from "@/lib/navigation";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import docsConfigJson from "../../docs.config.json";

const docsConfig = docsConfigJson as DocsConfig;

// Loader just passes the slug — all data fetching is client-side via React Query
export async function loader({ params }: LoaderFunctionArgs) {
  return { slug: params["*"] ?? "" };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const slug = data?.slug ?? "";
  const label = slugToLabel(slug);
  return [
    { title: `${label} — ${docsConfig.title}` },
    { name: "description", content: docsConfig.description ?? "" },
  ];
};

interface PageData {
  slug: string;
  code: string;
  frontmatter: Record<string, string>;
  tocEntries: TocEntry[];
}

export default function DocPage() {
  const { slug } = useLoaderData<typeof loader>();
  const [Component, setComponent] = useState<React.ComponentType<{ components?: Record<string, React.ComponentType> }> | null>(null);

  const { data, isLoading, error } = useQuery<PageData>({
    queryKey: ["page", slug],
    queryFn: async () => {
      const res = await fetch(`/api/content?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error(`Page not found: ${slug}`);
      return res.json();
    },
    enabled: !!slug,
  });

  const { prev, next } = useMemo(
    () => findAdjacentPages(slug, docsConfig.navigation),
    [slug],
  );

  useEffect(() => {
    if (!data?.code) return;
    let cancelled = false;
    setComponent(null);
    run(data.code, { ...runtime, baseUrl: import.meta.url })
      .then(({ default: Comp }) => {
        if (!cancelled) setComponent(() => Comp as React.ComponentType);
      })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [data?.code]);

  return (
    <DocsLayout config={docsConfig}>
      <div className="flex gap-8 max-w-full">
        <article className="flex-1 min-w-0 px-6 py-8 max-w-3xl">
          {isLoading && (
            <div className="animate-pulse space-y-4 mt-2">
              <div className="h-8 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="mt-8 space-y-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 text-muted-foreground">
              <p className="text-lg font-semibold text-foreground">Page not found</p>
              <p className="mt-1 text-sm">
                No page exists at <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{slug}</code>.
              </p>
            </div>
          )}

          {data && (
            <>
              {data.frontmatter.title && (
                <h1 className="text-3xl font-bold tracking-tight mb-1">{data.frontmatter.title}</h1>
              )}
              {data.frontmatter.description && (
                <p className="text-lg text-muted-foreground mb-8">{data.frontmatter.description}</p>
              )}

              <div className="docs-prose">
                {Component ? (
                  <Component components={docsComponents} />
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                )}
              </div>

              {(prev || next) && (
                <div className="mt-12 pt-6 border-t border-border flex items-center justify-between gap-4">
                  {prev ? (
                    <Link
                      to={`/docs/${prev}`}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <IconChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                      <div>
                        <p className="text-xs text-muted-foreground/60">Previous</p>
                        <p className="font-medium">{slugToLabel(prev)}</p>
                      </div>
                    </Link>
                  ) : <div />}
                  {next ? (
                    <Link
                      to={`/docs/${next}`}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground/60">Next</p>
                        <p className="font-medium">{slugToLabel(next)}</p>
                      </div>
                      <IconChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ) : <div />}
                </div>
              )}
            </>
          )}
        </article>

        <TableOfContents entries={data?.tocEntries ?? []} />
      </div>
    </DocsLayout>
  );
}
