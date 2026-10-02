import Link from "next/link";
import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardActivityItem } from "@/modules/dashboard/model/dashboard.types";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";

type DashboardActivityProps = {
  items: DashboardActivityItem[];
};

function ActivityContent({ item }: { item: DashboardActivityItem }) {
  return (
    <>
      <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full">
        <Activity className="text-muted-foreground size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{item.title}</p>

          {item.tone ? (
            <StatusBadge tone={item.tone} className="px-1.5 py-0">
              {item.time}
            </StatusBadge>
          ) : null}
        </div>

        {item.description ? (
          <p className="text-muted-foreground mt-1 text-xs leading-5">
            {item.description}
          </p>
        ) : null}

        {!item.tone ? (
          <p className="text-muted-foreground mt-1 text-xs">{item.time}</p>
        ) : null}
      </div>
    </>
  );
}

export function DashboardActivity({ items }: DashboardActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
            Chưa có hoạt động gần đây.
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) =>
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className="hover:bg-muted/40 -mx-2 flex gap-3 rounded-lg px-2 py-3 transition-colors first:pt-1 last:pb-1"
                >
                  <ActivityContent item={item} />
                </Link>
              ) : (
                <div
                  key={item.id}
                  className="flex gap-3 py-3 first:pt-1 last:pb-1"
                >
                  <ActivityContent item={item} />
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
