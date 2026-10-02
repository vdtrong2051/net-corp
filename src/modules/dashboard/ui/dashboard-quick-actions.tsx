import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardQuickAction } from "@/modules/dashboard/model/dashboard.types";

type DashboardQuickActionsProps = {
  actions: DashboardQuickAction[];
};

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Button
              key={action.id}
              variant={index === 0 ? "default" : "outline"}
              nativeButton={false}
              render={<Link href={action.href} />}
            >
              <Plus />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
