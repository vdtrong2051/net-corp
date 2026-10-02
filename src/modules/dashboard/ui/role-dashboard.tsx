"use client";

import { ManagerDashboard } from "@/modules/dashboard/ui/manager-dashboard";
import { OwnerDashboard } from "@/modules/dashboard/ui/owner-dashboard";
import { StaffDashboard } from "@/modules/dashboard/ui/staff-dashboard";
import { useMockSession } from "@/shared/providers/mock-session-provider";

export function RoleDashboard() {
  const { role } = useMockSession();

  switch (role) {
    case "STAFF":
      return <StaffDashboard />;

    case "MANAGER":
      return <ManagerDashboard />;

    case "OWNER":
      return <OwnerDashboard />;

    default:
      return null;
  }
}