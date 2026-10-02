import type { AppRole } from "@/shared/types/role";

export type DashboardTone =
  "neutral" | "pending" | "success" | "warning" | "danger" | "info";

export type DashboardKpiFormat = "number" | "currency";

export type DashboardKpi = {
  id: string;
  label: string;
  value: number;
  format: DashboardKpiFormat;
  description?: string;
  href: string;
  tone?: DashboardTone;
};

export type DashboardQueueDetail = {
  label: string;
  value: string;
};

export type DashboardQueueItem = {
  id: string;
  title: string;
  subtitle?: string;

  status: string;
  statusTone: DashboardTone;

  details?: DashboardQueueDetail[];

  waitingTime?: string;
  deadline?: string;

  href: string;
};

export type DashboardQueue = {
  id: string;
  title: string;
  description?: string;
  emptyMessage: string;
  items: DashboardQueueItem[];
};

export type DashboardSummaryItem = {
  id: string;
  label: string;
  value: string;
  tone?: DashboardTone;
  href: string;
};

export type DashboardQuickAction = {
  id: string;
  label: string;
  href: string;
};

export type DashboardActivityItem = {
  id: string;
  title: string;
  description?: string;
  time: string;
  tone?: DashboardTone;
  href?: string;
};

export type DashboardData = {
  role: AppRole;

  title: string;
  description: string;

  kpis: DashboardKpi[];

  primaryQueue: DashboardQueue;

  secondaryQueues?: DashboardQueue[];

  summary?: DashboardSummaryItem[];

  quickActions?: DashboardQuickAction[];

  recentActivity?: DashboardActivityItem[];
};
