import { Children, isValidElement } from "react";
import { cn } from "@/lib/utils";

interface StepProps {
  title?: string;
  children: React.ReactNode;
}

export function Step({ title, children }: StepProps) {
  return <div data-step title={title}>{children}</div>;
}

interface StepsProps {
  children: React.ReactNode;
}

export function Steps({ children }: StepsProps) {
  const steps = Children.toArray(children).filter(
    (child) => isValidElement(child) && (child as React.ReactElement<{ "data-step"?: boolean }>).props["data-step"] !== undefined,
  );

  if (steps.length === 0) {
    return (
      <ol className="my-4 space-y-0 list-none ml-0 pl-0">
        {Children.map(children, (child, i) => (
          <li className="relative flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xs font-bold text-primary z-10">
                {i + 1}
              </div>
              {i < Children.count(children) - 1 && (
                <div className="w-px flex-1 bg-border mt-1" />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-2">{child}</div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="my-4 space-y-0 list-none ml-0 pl-0">
      {steps.map((step, i) => {
        const el = step as React.ReactElement<StepProps>;
        return (
          <li key={i} className="relative flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xs font-bold text-primary z-10">
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-border mt-1" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {el.props.title && (
                <h3 className="text-base font-semibold mb-2 mt-0">{el.props.title}</h3>
              )}
              <div>{el.props.children}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
