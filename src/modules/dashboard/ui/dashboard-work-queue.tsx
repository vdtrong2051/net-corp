import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardQueue } from "@/modules/dashboard/model/dashboard.types";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";

type DashboardWorkQueueProps = {
  queue: DashboardQueue;
  maxItems?: number;
};

export function DashboardWorkQueue({
  queue,
  maxItems,
}: DashboardWorkQueueProps) {
  const visibleItems =
    typeof maxItems === "number"
      ? queue.items.slice(0, maxItems)
      : queue.items;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{queue.title}</CardTitle>

        {queue.description ? (
          <CardDescription>
            {queue.description}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent>
        {visibleItems.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
            {queue.emptyMessage}
          </div>
        ) : (
          <div className="divide-y">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {item.title}
                    </p>

                    <StatusBadge tone={item.statusTone}>
                      {item.status}
                    </StatusBadge>
                  </div>

                  {item.subtitle ? (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {item.subtitle}
                    </p>
                  ) : null}

                  {item.details?.length ? (
                    <div className="mt-3 grid gap-1.5 text-sm">
                      {item.details.map((detail) => (
                        <div
                          key={`${item.id}-${detail.label}`}
                          className="flex flex-wrap gap-1"
                        >
                          <span className="text-muted-foreground">
                            {detail.label}:
                          </span>

                          <span>
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {item.waitingTime || item.deadline ? (
                    <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      {item.waitingTime ? (
                        <span className="flex items-center gap-1">
                          <Clock3 className="size-3.5" />
                          Đã chờ {item.waitingTime}
                        </span>
                      ) : null}

                      {item.deadline ? (
                        <span>
                          Hạn: {item.deadline}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={item.href} />}
                >
                  Mở
                  <ArrowRight />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}