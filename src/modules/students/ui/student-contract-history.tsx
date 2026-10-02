import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ContractStatus,
  StudentProfile360,
} from "@/modules/students/model/student.types";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

const statusLabels: Record<ContractStatus, string> = {
  DRAFT: "Bản nháp",
  PENDING_SIGNATURE: "Chờ ký",
  SIGNED: "Đã ký",
  CANCELLED: "Đã hủy",
};

const statusTones: Record<ContractStatus, StatusTone> = {
  DRAFT: "neutral",
  PENDING_SIGNATURE: "pending",
  SIGNED: "success",
  CANCELLED: "danger",
};

function formatDateTime(value?: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type StudentContractHistoryProps = {
  profile: StudentProfile360;
};

export function StudentContractHistory({
  profile,
}: StudentContractHistoryProps) {
  const contracts = [...profile.contracts].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );

  if (contracts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">Chưa có hợp đồng</p>

        <p className="text-muted-foreground mt-1 text-sm">
          Chưa có hợp đồng nào gắn với học viên.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {contracts.map((contract) => (
        <Card key={contract.id}>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <CardTitle>{contract.contractCode}</CardTitle>

              <StatusBadge tone={statusTones[contract.status]}>
                {statusLabels[contract.status]}
              </StatusBadge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-xs">Enrollment</p>

                <p className="mt-1 font-medium">{contract.enrollmentId}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Ngày tạo</p>

                <p className="mt-1 font-medium">
                  {formatDateTime(contract.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Ngày ký</p>

                <p className="mt-1 font-medium">
                  {formatDateTime(contract.signedAt)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Tài liệu</p>

                <Button
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  render={
                    <a
                      href={contract.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <ExternalLink />
                  Mở hợp đồng
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
