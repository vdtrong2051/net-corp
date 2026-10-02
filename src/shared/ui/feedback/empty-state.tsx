import type { ReactNode } from "react";

import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  title = "Không có dữ liệu",
  description = "Hiện chưa có dữ liệu để hiển thị.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
      <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-full">
        {icon ?? <Inbox className="text-muted-foreground size-5" />}
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="text-muted-foreground mt-1 max-w-md text-sm">
        {description}
      </p>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
