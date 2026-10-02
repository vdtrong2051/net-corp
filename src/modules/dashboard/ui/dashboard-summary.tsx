import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardSummaryItem } from "@/modules/dashboard/model/dashboard.types";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";

type DashboardSummaryProps = {
  title: string;
  items: DashboardSummaryItem[];
};

export function DashboardSummary({
  title,
  items,
}: DashboardSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">
                  {item.label}
                </p>

                <div className="mt-1">
                  {item.tone ? (
                    <StatusBadge tone={item.tone}>
                      {item.value}
                    </StatusBadge>
                  ) : (
                    <p className="font-medium">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>

              <ArrowUpRight className="text-muted-foreground size-4 shrink-0" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}