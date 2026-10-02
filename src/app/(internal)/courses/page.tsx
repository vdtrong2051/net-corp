import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function CoursesPage() {
  return (
    <PageContainer
      title="Khóa học"
      description="Quản lý danh mục khóa học, chương trình và chính sách giá."
    >
      <EmptyState
        title="Danh mục khóa học"
        description="Dữ liệu và nghiệp vụ khóa học sẽ được bổ sung ở giai đoạn nghiệp vụ."
      />
    </PageContainer>
  );
}
