"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { canAccessRoute } from "@/shared/config/route-access";
import { useMockSession } from "@/shared/providers/mock-session-provider";
import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

type MockAccessGateProps = {
  children: ReactNode;
};

export function MockAccessGate({ children }: MockAccessGateProps) {
  const pathname = usePathname();
  const { role, user } = useMockSession();

  const allowed = canAccessRoute(pathname, role);

  if (allowed) {
    return children;
  }

  return (
    <PageContainer
      title="Không có quyền truy cập"
      description={`Vai trò ${user.roleLabel} không được phép truy cập khu vực này.`}
    >
      <EmptyState
        icon={<ShieldAlert className="text-destructive size-5" />}
        title="Quyền truy cập bị giới hạn"
        description="Hãy chuyển sang vai trò phù hợp hoặc quay lại Dashboard."
        action={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            Về Dashboard
          </Button>
        }
      />
    </PageContainer>
  );
}
