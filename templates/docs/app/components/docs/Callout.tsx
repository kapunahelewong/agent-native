import { cn } from "@/lib/utils";
import {
  IconInfoCircle,
  IconBulb,
  IconAlertTriangle,
  IconCircleX,
  IconCheck,
} from "@tabler/icons-react";

type CalloutType = "note" | "tip" | "warning" | "danger" | "success";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const styles: Record<CalloutType, { container: string; icon: string; Icon: React.ComponentType<{ className?: string }> }> = {
  note: {
    container: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
    icon: "text-blue-600 dark:text-blue-400",
    Icon: IconInfoCircle,
  },
  tip: {
    container: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    Icon: IconBulb,
  },
  warning: {
    container: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400",
    Icon: IconAlertTriangle,
  },
  danger: {
    container: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
    icon: "text-red-600 dark:text-red-400",
    Icon: IconCircleX,
  },
  success: {
    container: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
    icon: "text-green-600 dark:text-green-400",
    Icon: IconCheck,
  },
};

const defaultTitles: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
  success: "Success",
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  const style = styles[type];
  const { Icon } = style;
  return (
    <div className={cn("my-4 flex gap-3 rounded-lg border p-4", style.container)}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", style.icon)} />
      <div className="flex-1 min-w-0">
        {(title ?? defaultTitles[type]) && (
          <p className="font-semibold text-sm mb-1">{title ?? defaultTitles[type]}</p>
        )}
        <div className="text-sm [&>p:last-child]:mb-0">{children}</div>
      </div>
    </div>
  );
}

export const Note = (props: Omit<CalloutProps, "type">) => <Callout {...props} type="note" />;
export const Tip = (props: Omit<CalloutProps, "type">) => <Callout {...props} type="tip" />;
export const Warning = (props: Omit<CalloutProps, "type">) => <Callout {...props} type="warning" />;
export const Danger = (props: Omit<CalloutProps, "type">) => <Callout {...props} type="danger" />;
export const Success = (props: Omit<CalloutProps, "type">) => <Callout {...props} type="success" />;
