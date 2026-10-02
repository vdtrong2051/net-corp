"use client";

import * as React from "react";

import { DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogSize = "sm" | "md" | "lg";

const dialogSizes: Record<DialogSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
};

type AppDialogContentProps = React.ComponentProps<typeof DialogContent> & {
  size?: DialogSize;
};

export function AppDialogContent({
  size = "md",
  className,
  ...props
}: AppDialogContentProps) {
  return (
    <DialogContent
      className={cn(
        "max-h-[90vh] overflow-y-auto",
        dialogSizes[size],
        className
      )}
      {...props}
    />
  );
}
