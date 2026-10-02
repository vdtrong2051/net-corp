import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function SettingsPage() {
  return (
    <PageContainer
      title="Cài đặt"
      description="Thiết lập các cấu hình dùng chung của hệ thống NET CORP."
    >
      <EmptyState
        title="Cài đặt hệ thống"
        description="Các thiết lập quản trị sẽ được bổ sung sau khi nghiệp vụ chính ổn định."
      />
    </PageContainer>
  );
}
