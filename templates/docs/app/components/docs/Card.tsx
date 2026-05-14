import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { IconArrowRight } from "@tabler/icons-react";

interface CardProps {
  title: string;
  description?: string;
  href?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Card({ title, description, href, icon, children }: CardProps) {
  const content = (
    <div
      className={cn(
        "rounded-lg border border-border p-5 transition-colors",
        href && "hover:border-primary/50 hover:bg-accent/30 cursor-pointer group",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className="text-primary shrink-0">{icon}</span>}
            <p className="font-semibold text-sm text-foreground">{title}</p>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
          {children && <div className="mt-2 text-sm">{children}</div>}
        </div>
        {href && (
          <IconArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
        )}
      </div>
    </div>
  );

  if (!href) return content;
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <Link to={href}>{content}</Link>;
}

interface CardGroupProps {
  cols?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function CardGroup({ cols = 2, children }: CardGroupProps) {
  return (
    <div
      className={cn("my-4 grid gap-4", {
        "grid-cols-1": cols === 1,
        "grid-cols-1 sm:grid-cols-2": cols === 2,
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": cols === 3,
      })}
    >
      {children}
    </div>
  );
}
