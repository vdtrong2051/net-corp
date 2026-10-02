import { Skeleton } from "@/components/ui/skeleton";

type LoadingStateProps = {
  rows?: number;
};

export function LoadingState({ rows = 5 }: LoadingStateProps) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Đang tải dữ liệu">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="rounded-lg border p-4">
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
