import { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
}

export function CodeBlock({ children, language, filename, highlightLines }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border bg-muted/50">
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/80">
          <span className="text-xs text-muted-foreground font-mono">
            {filename ?? language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <IconCopy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <div className="relative group">
        {!filename && !language && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-3 top-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Copy code"
          >
            {copied ? (
              <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <IconCopy className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        <pre className="overflow-x-auto p-4 text-sm">
          <code className={language ? `language-${language}` : undefined}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
}

interface InlineCodeProps {
  children: React.ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
      {children}
    </code>
  );
}
