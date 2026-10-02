import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppHeader } from "@/shared/ui/layout/app-header";
import { AppSidebar } from "@/shared/ui/navigation/app-sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
