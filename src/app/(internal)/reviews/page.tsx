import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function ReviewsPage() {
  return (
    <PageContainer
      title="Kiểm tra hồ sơ"
      description="Hàng đợi hồ sơ chờ quản lý kiểm tra, duyệt hoặc trả lại."
    >
      <EmptyState
        title="Hàng đợi kiểm tra hồ sơ"
        description="Luồng duyệt và trả hồ sơ sẽ được xây dựng ở GĐ8."
      />
    </PageContainer>
  );
}
