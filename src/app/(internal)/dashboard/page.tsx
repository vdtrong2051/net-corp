import { PageContainer } from "@/shared/ui/layout/page-container";

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Tổng quan hoạt động của hệ thống NET CORP."
    >
      <div className="text-muted-foreground rounded-lg border p-6 text-sm">
        Dashboard nghiệp vụ sẽ được xây dựng ở GĐ4.
      </div>
    </PageContainer>
  );
}
