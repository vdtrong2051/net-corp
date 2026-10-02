import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  PaymentHistoryStatus,
  PaymentMethod,
  StudentProfile360,
} from "@/modules/students/model/student.types";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

const statusLabels: Record<PaymentHistoryStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  RETURNED: "Bị trả lại",
  CANCELLED: "Đã hủy",
};

const statusTones: Record<PaymentHistoryStatus, StatusTone> = {
  PENDING: "pending",
  CONFIRMED: "success",
  RETURNED: "danger",
  CANCELLED: "neutral",
};

const methodLabels: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Chuyển khoản",
  CASH: "Tiền mặt",
  OTHER: "Khác",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

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

type StudentPaymentHistoryProps = {
  profile: StudentProfile360;
};

export function StudentPaymentHistory({ profile }: StudentPaymentHistoryProps) {
  const payments = [...profile.payments].sort(
    (a, b) => Date.parse(b.paidAt ?? "") - Date.parse(a.paidAt ?? "")
  );

  const confirmedTotal = payments
    .filter((payment) => payment.status === "CONFIRMED")
    .reduce((total, payment) => total + payment.amount, 0);

  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">Chưa có thanh toán</p>

        <p className="text-muted-foreground mt-1 text-sm">
          Chưa ghi nhận giao dịch thanh toán nào.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="grid gap-4 pt-0 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-xs">Tổng giao dịch</p>

            <p className="mt-1 text-lg font-semibold">{payments.length}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Tổng đã xác nhận</p>

            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(confirmedTotal)}
            </p>
          </div>
        </CardContent>
      </Card>

      {payments.map((payment) => (
        <Card key={payment.id}>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{payment.installmentLabel}</CardTitle>

                <p className="text-muted-foreground mt-1 text-sm">
                  {formatDateTime(payment.paidAt)}
                </p>
              </div>

              <StatusBadge tone={statusTones[payment.status]}>
                {statusLabels[payment.status]}
              </StatusBadge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-xs">Số tiền</p>

                <p className="mt-1 font-medium">
                  {formatCurrency(payment.amount)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Phương thức</p>

                <p className="mt-1 font-medium">
                  {methodLabels[payment.method]}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Enrollment</p>

                <p className="mt-1 font-medium">{payment.enrollmentId}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Minh chứng</p>

                {payment.proofUrl ? (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    render={
                      <a
                        href={payment.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                  >
                    <ExternalLink />
                    Xem minh chứng
                  </Button>
                ) : (
                  <p className="mt-1 font-medium">Chưa có</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
