import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function EnrollmentsPage() {
  return (
    <PageContainer
      title="Ghi danh"
      description="Quản lý hồ sơ ghi danh và các khóa học học viên đăng ký."
    >
      <EmptyState
        title="Module ghi danh"
        description="Chức năng nghiệp vụ ghi danh sẽ được xây dựng ở GĐ6."
      />
    </PageContainer>
  );
}
