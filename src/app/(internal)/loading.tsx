import { PageContainer } from "@/shared/ui/layout/page-container";
import { LoadingState } from "@/shared/ui/feedback/loading-state";

export default function Loading() {
  return (
    <PageContainer
      title="Đang tải"
      description="Hệ thống đang chuẩn bị dữ liệu."
    >
      <LoadingState />
    </PageContainer>
  );
}
