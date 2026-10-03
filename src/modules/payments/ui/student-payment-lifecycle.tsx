"use client";

import Link from "next/link";
import { Eye, FileImage, Layers3, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getEnrollmentMock } from "@/modules/enrollments/data/enrollment.mock";
import type {
  PaymentMethod,
  PaymentStatus,
} from "@/modules/payments/model/payment.types";
import { usePaymentMockStore } from "@/modules/payments/service/payment-mock-store";

import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  RETURNED: "Bị trả lại",
  CANCELLED: "Đã hủy",
};

const statusTones: Record<PaymentStatus, StatusTone> = {
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type StudentPaymentLifecycleProps = {
  studentId: string;
};

export function StudentPaymentLifecycle({
  studentId,
}: StudentPaymentLifecycleProps) {
  const { payments } = usePaymentMockStore();

  /*
   * Student 360 giờ lấy Payment thật
   * từ shared lifecycle của GĐ7.
   */
  const studentPayments = payments
    .filter((payment) => payment.studentId === studentId)
    .sort((a, b) => Date.parse(b.paidAt) - Date.parse(a.paidAt));

  const confirmedTotal = studentPayments
    .filter((payment) => payment.status === "CONFIRMED")
    .reduce((total, payment) => total + payment.amount, 0);

  const pendingTotal = studentPayments
    .filter((payment) => payment.status === "PENDING")
    .reduce((total, payment) => total + payment.amount, 0);

  const returnedCount = studentPayments.filter(
    (payment) => payment.status === "RETURNED"
  ).length;

  if (studentPayments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <WalletCards className="text-muted-foreground mx-auto size-5" />

        <p className="mt-2 font-medium">Chưa có thanh toán</p>

        <p className="text-muted-foreground mt-1 text-sm">
          Học viên chưa có Payment nào trong financial lifecycle.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <section
        aria-label="Tổng quan thanh toán học viên"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <Card size="sm">
          <CardHeader>
            <CardDescription>Tổng giao dịch</CardDescription>

            <CardTitle className="text-xl tabular-nums">
              {studentPayments.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Đã xác nhận</CardDescription>

            <CardTitle className="text-xl tabular-nums">
              {formatCurrency(confirmedTotal)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Chờ xác nhận</CardDescription>

            <CardTitle className="text-xl tabular-nums">
              {formatCurrency(pendingTotal)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Bị trả lại</CardDescription>

            <CardTitle className="text-xl tabular-nums">
              {returnedCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <div className="grid gap-4">
        {studentPayments.map((payment) => {
          const enrollment = getEnrollmentMock(payment.enrollmentId);

          const allocationRows = payment.allocations.map((allocation) => {
            const course = enrollment?.items.find(
              (item) => item.id === allocation.enrollmentItemId
            );

            return {
              ...allocation,

              courseName: course?.courseName ?? "Không xác định",
            };
          });

          return (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>
                      <Link
                        href={`/payments/${payment.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {payment.paymentCode}
                      </Link>
                    </CardTitle>

                    <CardDescription className="mt-1">
                      {formatDateTime(payment.paidAt)}
                    </CardDescription>
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

                    <p className="mt-1 text-lg font-semibold tabular-nums">
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

                    <p className="mt-1 font-medium">
                      {enrollment?.enrollmentCode ?? payment.enrollmentId}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Minh chứng</p>

                    <div className="mt-1 flex items-center gap-1.5">
                      {payment.proof ? (
                        <>
                          <FileImage className="text-muted-foreground size-4" />

                          <span className="font-medium">Có ảnh</span>
                        </>
                      ) : (
                        <span className="font-medium">Không có</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <Layers3 className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Phân bổ</p>

                      {allocationRows.length > 0 ? (
                        <div className="mt-3 grid gap-2">
                          {allocationRows.map((allocation) => (
                            <div
                              key={allocation.id}
                              className="flex flex-wrap items-start justify-between gap-3"
                            >
                              <span className="text-sm">
                                {allocation.courseName}
                              </span>

                              <span className="text-sm font-medium tabular-nums">
                                {formatCurrency(allocation.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground mt-1 text-xs">
                          Chưa có allocation.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {payment.status === "RETURNED" && payment.returnedReason ? (
                  <div className="border-destructive/30 bg-destructive/5 mt-4 rounded-lg border p-3">
                    <p className="text-destructive text-sm font-medium">
                      Lý do trả lại
                    </p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {payment.returnedReason}
                    </p>
                  </div>
                ) : null}

                {payment.status === "CANCELLED" && payment.cancelledReason ? (
                  <div className="mt-4 rounded-lg border p-3">
                    <p className="text-sm font-medium">Giao dịch đã hủy</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {payment.cancelledReason}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    nativeButton={false}
                    variant="outline"
                    size="sm"
                    render={<Link href={`/payments/${payment.id}`} />}
                  >
                    <Eye />
                    Chi tiết
                  </Button>

                  {enrollment ? (
                    <Button
                      nativeButton={false}
                      variant="ghost"
                      size="sm"
                      render={
                        <Link href={`/payments/enrollments/${enrollment.id}`} />
                      }
                    >
                      <WalletCards />
                      Tài chính
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
