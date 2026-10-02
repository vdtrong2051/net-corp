import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function ClassesPage() {
  return (
    <PageContainer
      title="Lớp học"
      description="Quản lý lớp và phân lớp cho học viên sau khi đủ điều kiện."
    >
      <EmptyState
        title="Module lớp học"
        description="Chức năng quản lý và phân lớp sẽ được xây dựng ở GĐ11."
      />
    </PageContainer>
  );
}
