import type { MDXComponents } from "mdx/types";
import { Callout, Note, Tip, Warning, Danger, Success } from "./Callout";
import { CodeBlock, InlineCode } from "./CodeBlock";
import { Steps, Step } from "./Steps";
import { Tabs, Tab } from "./Tabs";
import { Card, CardGroup } from "./Card";
import { Accordion, AccordionItem } from "./Accordion";
import { Badge } from "./Badge";
import { ApiEndpoint } from "./ApiEndpoint";

export const docsComponents: MDXComponents = {
  // Callouts
  Callout,
  Note,
  Tip,
  Warning,
  Danger,
  Success,

  // Code
  pre: (props) => {
    const child = (props.children as React.ReactElement<{ className?: string; children?: string }>);
    if (!child) return <pre {...props} />;
    const className = child.props?.className ?? "";
    const language = className.replace("language-", "");
    const code = child.props?.children ?? "";
    return <CodeBlock language={language || undefined}>{String(code).replace(/\n$/, "")}</CodeBlock>;
  },
  code: (props) => {
    if (typeof props.children === "string") {
      return <InlineCode>{props.children}</InlineCode>;
    }
    return <code {...props} />;
  },

  // Layout
  Steps,
  Step,
  Tabs,
  Tab,
  Card,
  CardGroup,
  Accordion,
  AccordionItem,
  Badge,
  ApiEndpoint,

  // Typography overrides — these get applied automatically to all MDX prose
  h1: ({ children }) => (
    <h1 id={toId(String(children))} className="text-3xl font-bold tracking-tight mt-8 mb-4 first:mt-0 scroll-mt-20">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 id={toId(String(children))} className="text-2xl font-semibold tracking-tight mt-10 mb-4 border-b border-border pb-2 scroll-mt-20">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={toId(String(children))} className="text-xl font-semibold tracking-tight mt-8 mb-3 scroll-mt-20">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 id={toId(String(children))} className="text-lg font-semibold tracking-tight mt-6 mb-2 scroll-mt-20">
      {children}
    </h4>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 hover:text-primary/80"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border bg-muted px-4 py-2.5 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border/50 px-4 py-2.5 last-of-type:border-0">
      {children}
    </td>
  ),
  hr: () => <hr className="border-border my-8" />,
};

function toId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
