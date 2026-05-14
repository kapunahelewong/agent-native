import { useState } from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  POST: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  PATCH: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

interface ParamRow {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

interface ApiEndpointProps {
  method: HttpMethod;
  path: string;
  description?: string;
  params?: ParamRow[];
  bodyParams?: ParamRow[];
  response?: string;
  children?: React.ReactNode;
}

export function ApiEndpoint({
  method,
  path,
  description,
  params,
  bodyParams,
  response,
  children,
}: ApiEndpointProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
      >
        <span
          className={cn(
            "inline-flex items-center rounded px-2 py-0.5 text-xs font-bold font-mono shrink-0",
            methodColors[method],
          )}
        >
          {method}
        </span>
        <code className="text-sm font-mono text-foreground">{path}</code>
        {description && (
          <span className="text-sm text-muted-foreground ml-2 truncate">{description}</span>
        )}
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-4">
          {children && <div className="text-sm">{children}</div>}

          {params && params.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Path Parameters</p>
              <ParamsTable rows={params} />
            </div>
          )}

          {bodyParams && bodyParams.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Body Parameters</p>
              <ParamsTable rows={bodyParams} />
            </div>
          )}

          {response && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Response</p>
              <CodeBlock language="json">{response}</CodeBlock>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ParamsTable({ rows }: { rows: ParamRow[] }) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-2 pr-4 font-medium text-muted-foreground w-32">Name</th>
          <th className="text-left py-2 pr-4 font-medium text-muted-foreground w-24">Type</th>
          <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name} className="border-b border-border/50 last:border-0">
            <td className="py-2 pr-4">
              <code className="text-xs font-mono">{row.name}</code>
              {row.required && <span className="ml-1 text-red-500 text-xs">*</span>}
            </td>
            <td className="py-2 pr-4">
              <code className="text-xs font-mono text-muted-foreground">{row.type}</code>
            </td>
            <td className="py-2 text-muted-foreground">{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
