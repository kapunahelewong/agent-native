import { Children, isValidElement, useState } from "react";
import { cn } from "@/lib/utils";

interface TabProps {
  title: string;
  children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

interface TabsProps {
  children: React.ReactNode;
  defaultTab?: string;
}

export function Tabs({ children, defaultTab }: TabsProps) {
  const tabChildren = Children.toArray(children).filter(
    (child) => isValidElement(child),
  ) as React.ReactElement<TabProps>[];

  const titles = tabChildren.map((c) => c.props.title ?? "Tab");
  const [active, setActive] = useState(defaultTab ?? titles[0] ?? "");

  const activeIndex = titles.indexOf(active);
  const activeContent = tabChildren[activeIndex >= 0 ? activeIndex : 0];

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <div className="flex border-b border-border bg-muted/50 overflow-x-auto">
        {titles.map((title) => (
          <button
            key={title}
            type="button"
            onClick={() => setActive(title)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
              active === title
                ? "border-primary text-foreground bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="p-4">{activeContent}</div>
    </div>
  );
}
