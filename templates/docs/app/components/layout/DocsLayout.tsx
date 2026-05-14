import { useState } from "react";
import { useLocation } from "react-router";
import { AgentSidebar } from "@agent-native/core/client";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Header } from "./Header";
import { DocsSidebar } from "./DocsSidebar";
import type { DocsConfig } from "@/lib/navigation";

interface DocsLayoutProps {
  config: DocsConfig;
  children: React.ReactNode;
}

export function DocsLayout({ config, children }: DocsLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AgentSidebar
      position="right"
      defaultOpen={true}
      emptyStateText="How can I help with your docs?"
      suggestions={[
        "Create a new page under Getting Started",
        "Find and replace all instances of a word",
        "Add a warning callout to the current page",
        "List all pages that mention authentication",
      ]}
    >
      <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
        <Header config={config} onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[260px]">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">Documentation navigation</SheetDescription>
              <div className="overflow-y-auto h-full">
                <DocsSidebar config={config} />
              </div>
            </SheetContent>
          </Sheet>

          <DocsSidebar config={config} />

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AgentSidebar>
  );
}
