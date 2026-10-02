import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function StudentsPage() {
  return (
    <PageContainer
      title="Học viên"
      description="Quản lý hồ sơ và lịch sử học tập của học viên."
      actions={
        <Button>
          <Plus />
          Thêm học viên
        </Button>
      }
    >
      <div className="rounded-lg border p-6">
        Danh sách học viên sẽ được xây dựng ở GĐ5.
      </div>
    </PageContainer>
  );
}
