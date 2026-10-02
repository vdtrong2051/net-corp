import { PageContainer } from "@/shared/ui/layout/page-container";

import { DesignSystemShowcase } from "./design-system-showcase";

export default function UIPlaygroundPage() {
  return (
    <PageContainer
      title="Design System"
      description="Bộ component và quy ước giao diện dùng chung trong NET CORP."
    >
      <DesignSystemShowcase />
    </PageContainer>
  );
}
