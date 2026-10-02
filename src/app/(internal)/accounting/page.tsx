import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function AccountingPage() {
  return (
    <PageContainer
      title="Kế toán"
      description="Theo dõi hồ sơ đã duyệt và công việc liên quan đến hóa đơn."
    >
      <EmptyState
        title="Hàng đợi kế toán"
        description="Chức năng kế toán và hóa đơn sẽ được xây dựng ở GĐ10."
      />
    </PageContainer>
  );
}
