import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  DashboardKpi,
  DashboardTone,
} from "@/modules/dashboard/model/dashboard.types";
import { typography } from "@/shared/config/typography";

type DashboardKpiCardProps = {
  kpi: DashboardKpi;
};

const toneStyles: Record<DashboardTone, string> = {
  neutral: "border-l-border",
  pending: "border-l-warning",
  success: "border-l-success",
  warning: "border-l-warning",
  danger: "border-l-destructive",
  info: "border-l-info",
};

function formatKpiValue(kpi: DashboardKpi) {
  if (kpi.format === "currency") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(kpi.value);
  }

  return new Intl.NumberFormat("vi-VN").format(kpi.value);
}

export function DashboardKpiCard({
  kpi,
}: DashboardKpiCardProps) {
  const tone = kpi.tone ?? "neutral";

  return (
    <Link
      href={kpi.href}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card
        className={cn(
          "h-full border-l-4 transition-colors hover:bg-muted/30",
          toneStyles[tone]
        )}
      >
        <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {kpi.label}
          </CardTitle>

          <ArrowUpRight className="text-muted-foreground size-4" />
        </CardHeader>

        <CardContent>
          <div
            className={cn(
              "text-2xl font-semibold tracking-tight",
              typography.numeric
            )}
          >
            {formatKpiValue(kpi)}
          </div>

          {kpi.description ? (
            <p className="text-muted-foreground mt-2 text-xs leading-5">
              {kpi.description}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}