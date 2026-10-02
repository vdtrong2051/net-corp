import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Có lỗi xảy ra",
  description = "Không thể tải dữ liệu. Vui lòng thử lại.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
      <div className="bg-destructive/10 mb-4 flex size-12 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive size-5" />
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="text-muted-foreground mt-1 max-w-md text-sm">
        {description}
      </p>

      {onRetry ? (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Thử lại
        </Button>
      ) : null}
    </div>
  );
}
