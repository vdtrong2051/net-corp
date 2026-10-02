import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function PaymentsPage() {
  return (
    <PageContainer
      title="Thanh toán"
      description="Theo dõi kế hoạch thanh toán, các lần thu và minh chứng chuyển khoản."
    >
      <EmptyState
        title="Module thanh toán"
        description="Chức năng nghiệp vụ thanh toán sẽ được xây dựng ở GĐ7."
      />
    </PageContainer>
  );
}
