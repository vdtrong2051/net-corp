"use client";

import { useEffect } from "react";

import { ErrorState } from "@/shared/ui/feedback/error-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

type InternalErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function InternalError({ error, reset }: InternalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer
      title="Có lỗi xảy ra"
      description="Không thể hoàn thành yêu cầu."
    >
      <ErrorState
        title="Không thể tải trang"
        description="Đã xảy ra lỗi khi xử lý dữ liệu. Vui lòng thử lại."
        onRetry={reset}
      />
    </PageContainer>
  );
}
