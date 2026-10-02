import type { ReactNode } from "react";

import { MockSessionProvider } from "@/shared/providers/mock-session-provider";
import { MockAccessGate } from "@/shared/ui/auth/mock-access-gate";
import { AppShell } from "@/shared/ui/layout/app-shell";

type InternalLayoutProps = {
  children: ReactNode;
};

export default function InternalLayout({ children }: InternalLayoutProps) {
  return (
    <MockSessionProvider>
      <AppShell>
        <MockAccessGate>{children}</MockAccessGate>
      </AppShell>
    </MockSessionProvider>
  );
}
