import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function UsersPage() {
  return (
    <PageContainer
      title="Tài khoản"
      description="Quản lý tài khoản nhân viên, quản lý và trạng thái sử dụng."
    >
      <EmptyState
        title="Quản lý tài khoản"
        description="Chức năng quản trị tài khoản sẽ được xây dựng ở GĐ12."
      />
    </PageContainer>
  );
}
