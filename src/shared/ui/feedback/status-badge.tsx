import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusTone =
  "neutral" | "pending" | "success" | "warning" | "danger" | "info";

const statusToneStyles: Record<StatusTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",

  pending: "border-warning/30 bg-warning/10 text-warning",

  success: "border-success/30 bg-success/10 text-success",

  warning: "border-warning/30 bg-warning/10 text-warning",

  danger: "border-destructive/30 bg-destructive/10 text-destructive",

  info: "border-info/30 bg-info/10 text-info",
};

type StatusBadgeProps = Omit<React.ComponentProps<typeof Badge>, "variant"> & {
  tone?: StatusTone;
};

export function StatusBadge({
  tone = "neutral",
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(statusToneStyles[tone], className)}
      {...props}
    />
  );
}
